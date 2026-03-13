"""
Flood Risk Prediction Model
Input features: rainfall, river_level, soil_moisture, temperature, humidity, wind_speed, days_of_rain
Output: risk_score (0-100), risk_level (Low/Medium/High/Critical)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def generate_flood_data(n=5000):
    np.random.seed(42)

    # Generate realistic feature distributions
    rainfall         = np.random.exponential(30, n)           # mm/day
    river_level      = np.random.uniform(0, 15, n)            # meters
    soil_moisture    = np.random.uniform(10, 100, n)          # percentage
    temperature      = np.random.uniform(18, 45, n)           # celsius
    humidity         = np.random.uniform(40, 100, n)          # percentage
    wind_speed       = np.random.uniform(0, 80, n)            # km/h
    days_of_rain     = np.random.randint(0, 30, n)            # days
    elevation        = np.random.uniform(0, 500, n)           # meters above sea level

    # Risk score based on domain logic (0-100)
    risk_score = (
        np.clip(rainfall / 2, 0, 30) +
        np.clip(river_level * 3, 0, 25) +
        np.clip((soil_moisture - 50) / 2, 0, 15) +
        np.clip(humidity / 10, 0, 10) +
        np.clip(days_of_rain * 0.8, 0, 12) +
        np.clip((50 - elevation) / 10, 0, 8)
    )
    risk_score = np.clip(risk_score + np.random.normal(0, 5, n), 0, 100)

    # Risk level labels
    def score_to_level(score):
        if score >= 75: return 3   # Critical
        elif score >= 55: return 2 # High
        elif score >= 30: return 1 # Medium
        else: return 0             # Low

    risk_level = np.array([score_to_level(s) for s in risk_score])

    df = pd.DataFrame({
        'rainfall': rainfall,
        'river_level': river_level,
        'soil_moisture': soil_moisture,
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'days_of_rain': days_of_rain,
        'elevation': elevation,
        'risk_score': risk_score,
        'risk_level': risk_level,
    })
    return df

def train_flood_model():
    print("🌊 Training Flood Risk Model...")
    df = generate_flood_data(5000)

    features = ['rainfall', 'river_level', 'soil_moisture', 'temperature', 'humidity', 'wind_speed', 'days_of_rain', 'elevation']
    X = df[features]
    y_class = df['risk_level']
    y_reg   = df['risk_score']

    X_train, X_test, yc_train, yc_test, yr_train, yr_test = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42
    )

    # Classifier for risk level
    clf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)),
    ])
    clf_pipeline.fit(X_train, yc_train)
    clf_acc = clf_pipeline.score(X_test, yc_test)

    # Regressor for risk score
    reg_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('reg', GradientBoostingRegressor(n_estimators=100, random_state=42)),
    ])
    reg_pipeline.fit(X_train, yr_train)

    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(clf_pipeline, 'models/flood_classifier.pkl')
    joblib.dump(reg_pipeline, 'models/flood_regressor.pkl')
    joblib.dump(features, 'models/flood_features.pkl')

    print(f"   ✅ Classifier Accuracy : {clf_acc:.2%}")
    print(f"   ✅ Models saved to models/flood_*.pkl")
    return clf_pipeline, reg_pipeline

if __name__ == '__main__':
    train_flood_model()
