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

def load_model(model_path="models/improved_university_recommender.pkl"):
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
            df1 = pd.read_csv("gradPilot_train.csv")
            df2 = pd.read_csv("Synthetic_Admission_Dataset.csv")
            df = pd.concat([df1, df2], ignore_index=True)
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
        
        # Create test data for all universities
        test_data = []
        for uni in universities:
            test_row = user_profile.copy()
            test_row['University'] = uni
            test_data.append(test_row)
        
        test_df = pd.DataFrame(test_data)
        test_df = create_features(test_df)
        
        # Make predictions
        probabilities = model.predict_proba(test_df)[:, 1]
        
        # Create results
        results = []
        for i, uni in enumerate(universities):
            results.append({
                'University': uni,
                'Admission_Probability': float(probabilities[i]),
                'Recommendation_Score': float(probabilities[i])  # Using probability as score for now
            })
        
        return results
        
    except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
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
    
    # Load model
    model_data = load_model(args.model)
    if model_data is None:
        sys.exit(1)
    
    # Get predictions
    results = predict_probabilities(user_profile, model_data)
    
    # Output results as JSON
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main() 