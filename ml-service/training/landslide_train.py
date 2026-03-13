"""
Landslide Risk Prediction Model
Input features: rainfall, slope_angle, soil_type_index, vegetation_index,
                soil_moisture, earthquake_proximity, previous_landslides
Output: risk_score (0-100), probability (0-1)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def generate_landslide_data(n=5000):
    np.random.seed(44)

    rainfall              = np.random.exponential(40, n)        # mm
    slope_angle           = np.random.uniform(5, 70, n)         # degrees
    soil_type_index       = np.random.uniform(0, 10, n)         # 0=rocky, 10=loose
    vegetation_index      = np.random.uniform(0, 1, n)          # NDVI 0-1
    soil_moisture         = np.random.uniform(10, 100, n)       # %
    earthquake_proximity  = np.random.uniform(0, 200, n)        # km
    previous_landslides   = np.random.randint(0, 10, n)         # count

    # Probability of landslide (0-1)
    raw_prob = (
        np.clip(rainfall / 150, 0, 0.3) +
        np.clip(slope_angle / 150, 0, 0.3) +
        np.clip(soil_type_index / 30, 0, 0.15) +
        np.clip((1 - vegetation_index) * 0.15, 0, 0.15) +
        np.clip(soil_moisture / 500, 0, 0.1)  +
        np.clip((200 - earthquake_proximity) / 2000, 0, 0.1)
    )
    probability = np.clip(raw_prob + np.random.normal(0, 0.05, n), 0, 1)
    risk_score  = probability * 100

    # Binary: landslide occurred?
    occurred = (probability > 0.5).astype(int)

    df = pd.DataFrame({
        'rainfall': rainfall,
        'slope_angle': slope_angle,
        'soil_type_index': soil_type_index,
        'vegetation_index': vegetation_index,
        'soil_moisture': soil_moisture,
        'earthquake_proximity': earthquake_proximity,
        'previous_landslides': previous_landslides,
        'probability': probability,
        'risk_score': risk_score,
        'occurred': occurred,
    })
    return df

def train_landslide_model():
    print("⛰️  Training Landslide Risk Model...")
    df = generate_landslide_data(5000)

    features = ['rainfall', 'slope_angle', 'soil_type_index', 'vegetation_index',
                'soil_moisture', 'earthquake_proximity', 'previous_landslides']
    X = df[features]
    y_class = df['occurred']
    y_reg   = df['risk_score']

    X_train, X_test, yc_train, yc_test, yr_train, yr_test = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42
    )

    clf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ])
    clf_pipeline.fit(X_train, yc_train)
    clf_acc = clf_pipeline.score(X_test, yc_test)

    reg_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('reg', GradientBoostingRegressor(n_estimators=100, random_state=42)),
    ])
    reg_pipeline.fit(X_train, yr_train)

    os.makedirs('models', exist_ok=True)
    joblib.dump(clf_pipeline, 'models/landslide_classifier.pkl')
    joblib.dump(reg_pipeline, 'models/landslide_regressor.pkl')
    joblib.dump(features,     'models/landslide_features.pkl')

    print(f"   ✅ Classifier Accuracy : {clf_acc:.2%}")
    print(f"   ✅ Models saved to models/landslide_*.pkl")
    return clf_pipeline, reg_pipeline

if __name__ == '__main__':
    train_landslide_model()
