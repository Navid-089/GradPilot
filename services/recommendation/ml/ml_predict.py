#!/usr/bin/env python3
"""
ML Prediction Script for GradPilot University Recommendations
This script is called by the Java service to get university recommendations.
"""

import sys
import json
import argparse
import pandas as pd
import joblib
import numpy as np
from pathlib import Path

def load_model(model_path="ml/models/improved_university_recommender.pkl"):
    """Load the trained model"""
    try:
        model_data = joblib.load(model_path)
        return model_data
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return None

def clean_paper(x):
    """Clean paper count data"""
    try:
        return int(x)
    except:
        if isinstance(x, str) and '+' in x:
            return int(x.replace('+', ''))
        return 0

def create_features(df):
    """Create features for the model"""
    df = df.copy()
    df['Paper'] = df['Paper'].apply(clean_paper)
    df['Academic_Score'] = (df['CGPA'] * 0.4 +
                            (df['GRE'] / 340) * 0.3 +
                            (df['TOEFL'] / 120) * 0.15 +
                            (df['IELTS'] / 9) * 0.15)
    df['Research_Experience'] = (df['Paper'] > 0).astype(int)
    df['Strong_Research'] = (df['Paper'] >= 2).astype(int)
    df['Has_Work_Experience'] = (~df['Work_Experience'].isin(['No', 'None', 'N/A'])).astype(int)
    df['Has_Gap'] = (df['Gap_year'] > 0).astype(int)
    df['Strong_Academic'] = ((df['CGPA'] >= 3.7) & (df['GRE'] >= 320)).astype(int)
    df['International'] = ((df['TOEFL'] > 0) | (df['IELTS'] > 0)).astype(int)
    return df

def predict_probabilities(user_profile, model_data):
    """Predict admission probabilities for all universities"""
    try:
        model = model_data['model']
        
        # Load datasets to get university list
        try:
            # Add debug info about current working directory
            import os
            print(f"[DEBUG] Current working directory: {os.getcwd()}", file=sys.stderr)
            print(f"[DEBUG] Script location: {os.path.dirname(os.path.abspath(__file__))}", file=sys.stderr)
            
            # Get the script's directory to build absolute paths
            script_dir = Path(__file__).resolve().parent
            print(f"[DEBUG] Script directory: {script_dir}", file=sys.stderr)
            
            # Try multiple possible paths for the CSV files
            possible_paths = [
                # 1. Relative to script directory (should work in Docker and dev)
                (script_dir / "models" / "gradPilot_train.csv", script_dir / "models" / "Synthetic_Admission_Dataset.csv"),
                # 2. Relative to working directory - common Docker scenario
                ("ml/models/gradPilot_train.csv", "ml/models/Synthetic_Admission_Dataset.csv"),
                # 3. Absolute path in Docker container (if files are copied there)
                ("/app/ml/models/gradPilot_train.csv", "/app/ml/models/Synthetic_Admission_Dataset.csv"),
                # 4. Alternative Docker paths
                ("./ml/models/gradPilot_train.csv", "./ml/models/Synthetic_Admission_Dataset.csv"),
                # 5. Direct relative paths (fallback)
                ("models/gradPilot_train.csv", "models/Synthetic_Admission_Dataset.csv")
            ]
            
            df = None
            for train_path, synthetic_path in possible_paths:
                try:
                    print(f"[DEBUG] Trying paths: {train_path}, {synthetic_path}", file=sys.stderr)
                    
                    # Check if files exist before trying to read
                    if isinstance(train_path, Path):
                        train_exists = train_path.exists()
                        synthetic_exists = synthetic_path.exists()
                    else:
                        train_exists = os.path.exists(train_path)
                        synthetic_exists = os.path.exists(synthetic_path)
                    
                    print(f"[DEBUG] Files exist - Train: {train_exists}, Synthetic: {synthetic_exists}", file=sys.stderr)
                    
                    if train_exists and synthetic_exists:
                        df1 = pd.read_csv(train_path)
                        df2 = pd.read_csv(synthetic_path)
                        df = pd.concat([df1, df2], ignore_index=True)
                        print(f"[DEBUG] Successfully loaded {len(df1)} + {len(df2)} = {len(df)} records", file=sys.stderr)
                        break
                    else:
                        print(f"[DEBUG] Files not found at {train_path}, {synthetic_path}", file=sys.stderr)
                except Exception as e:
                    print(f"[DEBUG] Failed to load from {train_path}: {e}", file=sys.stderr)
                    continue
            
            if df is None:
                print("[DEBUG] Could not find CSV files in any expected location, using fallback", file=sys.stderr)
                raise FileNotFoundError("Could not find CSV files in any expected location")
        except FileNotFoundError:
            # If datasets not found, use a default university list
            universities = [
                "Massachusetts Institute of Technology", "Harvard University", "Stanford University",
                "University of California, Berkeley", "Carnegie Mellon University", "University of Michigan",
                "Georgia Institute of Technology", "University of Illinois at Urbana-Champaign",
                "University of Texas at Austin", "University of Washington", "Cornell University",
                "University of California, Los Angeles", "University of Wisconsin-Madison",
                "University of Maryland", "Purdue University", "University of Pennsylvania",
                "Columbia University", "Princeton University", "Yale University", "Duke University"
            ]
            df = pd.DataFrame({'University': universities})
        
        universities = df['University'].dropna().unique()
        print(f"[DEBUG] Total unique universities loaded: {len(universities)}", file=sys.stderr)
        print(f"[DEBUG] First 5 universities: {universities[:5].tolist()}", file=sys.stderr)
        
        # Filter universities based on user preferences if provided
        user_target_countries = user_profile.get('Target_Countries', '').split(',')
        user_target_majors = user_profile.get('Target_Majors', '').split(',')
        user_research_interests = user_profile.get('Research_Interests', '').split(',')
        
        # Create test data for all universities
        test_data = []
        for uni in universities:
            test_row = user_profile.copy()
            test_row['University'] = uni
            
            # Remove our custom fields that the ML model doesn't expect
            test_row.pop('Target_Countries', None)
            test_row.pop('Target_Majors', None)
            test_row.pop('Research_Interests', None)
            
            test_data.append(test_row)
        
        test_df = pd.DataFrame(test_data)
        test_df = create_features(test_df)
        
        # Make predictions
        probabilities = model.predict_proba(test_df)[:, 1]
        
        # Apply preference-based scoring adjustments
        adjusted_probabilities = []
        for i, uni in enumerate(universities):
            prob = float(probabilities[i])
            
            # Boost probability for universities matching user preferences
            boost_factor = 1.0
            
            # Country preference boost
            if user_target_countries and user_target_countries[0].strip():
                # This is a simplified country matching - in a real system, 
                # you'd have a university-to-country mapping
                for country in user_target_countries:
                    if country.strip().lower() in uni.lower():
                        boost_factor *= 1.2
                        break
            
            # Apply CGPA-based filtering for realistic recommendations
            user_cgpa = user_profile.get('CGPA', 3.5)
            if user_cgpa >= 3.7 and 'MIT' in uni or 'Harvard' in uni or 'Stanford' in uni:
                boost_factor *= 1.3  # High CGPA gets boost for top universities
            elif user_cgpa < 3.3 and ('MIT' in uni or 'Harvard' in uni or 'Stanford' in uni):
                boost_factor *= 0.7  # Lower CGPA gets penalty for top universities
            
            # Research interest boost (simplified)
            if user_research_interests and user_research_interests[0].strip():
                if any('tech' in interest.lower() or 'engineering' in interest.lower() 
                      for interest in user_research_interests):
                    if 'MIT' in uni or 'Carnegie Mellon' in uni or 'Georgia Tech' in uni:
                        boost_factor *= 1.2
            
            adjusted_prob = min(prob * boost_factor, 0.95)  # Cap at 95%
            adjusted_probabilities.append(adjusted_prob)
        
        # Create results with personalized scores
        results = []
        for i, uni in enumerate(universities):
            results.append({
                'University': uni,
                'Admission_Probability': adjusted_probabilities[i],
                'Recommendation_Score': adjusted_probabilities[i],
                'Match_Reason': f"Based on CGPA: {user_profile.get('CGPA', 'N/A')}, GRE: {user_profile.get('GRE', 'N/A')}"
            })
        
        # Sort by adjusted probability
        results.sort(key=lambda x: x['Admission_Probability'], reverse=True)
        
        return results
        
    except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return []

def main():
    parser = argparse.ArgumentParser(description='Get university recommendations')
    parser.add_argument('--profile', required=True, help='Path to user profile JSON file')
    parser.add_argument('--model', default='models/improved_university_recommender.pkl', 
                       help='Path to trained model')
    
    args = parser.parse_args()
    
    # Load user profile
    try:
        with open(args.profile, 'r') as f:
            user_profile = json.load(f)
    except Exception as e:
        print(f"Error loading user profile: {e}", file=sys.stderr)
        sys.exit(1)

    # Step 1: Ensure fields exist
    required_keys = [
        'CGPA', 'GRE', 'TOEFL', 'IELTS', 'Paper', 'Gap_year', 'Work_Experience',
        'Ugrad', 'Ugrad_Major', 'Funding', 'Degree'
    ]
    for key in required_keys:
        if key not in user_profile:
            user_profile[key] = "Unknown" if key in ['Ugrad', 'Ugrad_Major', 'Funding', 'Degree'] else 0

    # ✅ Step 2: Force categorical string fields to str
    for key in ['Ugrad', 'Ugrad_Major', 'Funding', 'Degree', 'Work_Experience']:
        user_profile[key] = str(user_profile[key])

    for key in required_keys:
        user_profile.setdefault(key, 0)
    
    # Load model
    model_data = load_model(args.model)
    if model_data is None:
        sys.exit(1)
    
    # Get predictions
    results = predict_probabilities(user_profile, model_data)
    
    # Output results as JSON
    print(f"[DEBUG] Final ML Results Count: {len(results)}", file=sys.stderr)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main() 