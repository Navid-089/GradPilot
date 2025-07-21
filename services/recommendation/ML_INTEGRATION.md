# ML Integration for University Recommendations

This service now includes ML-powered university recommendations using a trained machine learning model.

## Features

- **University Recommendations**: ML-based predictions for university admission probabilities
- **Professor Recommendations**: Existing logic for professor matching
- **Category-based Filtering**: Reach, Match, and Safety universities
- **Combined API**: Get both university and professor recommendations

## API Endpoints

### University Recommendations
- `GET /api/recommendations/universities` - Get all university recommendations
- `GET /api/recommendations/universities/category/{category}` - Get recommendations by category (reach/match/safety)
- `GET /api/recommendations/universities/category/{category}?limit=10` - Limit results

### Professor Recommendations
- `GET /api/recommendations/professors` - Get professor recommendations

### Combined
- `GET /api/recommendations/all` - Get both university and professor recommendations

## Setup

### 1. Copy ML Files
Run the copy script to transfer your ML model and datasets:
```bash
chmod +x copy_ml_files.sh
./copy_ml_files.sh
```

### 2. Build and Deploy
```bash
# Build the service
docker build -t gradpilot-recommendation .

# Or use docker-compose
docker-compose up recommendation --build
```

## ML Model Details

The service uses:
- **Model**: `improved_university_recommender.pkl` (XGBoost/LightGBM ensemble)
- **Features**: CGPA, GRE, TOEFL, IELTS, Research Experience, Work Experience, etc.
- **Output**: Admission probability and recommendation score for each university

## User Profile Mapping

The service automatically maps user data to ML model input:
- GPA → CGPA
- Test scores → GRE, TOEFL, IELTS
- Default values for missing fields

## Response Format

```json
{
  "university": "Massachusetts Institute of Technology",
  "admissionProbability": 0.85,
  "recommendationScore": 0.85,
  "category": "match"
}
```

## Categories

- **Reach**: recommendationScore < 0.4
- **Match**: 0.4 ≤ recommendationScore < 0.7  
- **Safety**: recommendationScore ≥ 0.7

## Troubleshooting

1. **Model not found**: Ensure `improved_university_recommender.pkl` is in `ml/models/`
2. **Datasets not found**: Copy `gradPilot_train.csv` and `Synthetic_Admission_Dataset.csv` to `ml/`
3. **Python errors**: Check Python dependencies in `requirements.txt` 