"""
Cyclone Risk Prediction Model
Input features: wind_speed, pressure, sea_surface_temp, distance_from_coast,
                humidity, storm_surge, satellite_intensity
Output: risk_score (0-100), category (1-5), landfall_hours
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def generate_cyclone_data(n=5000):
    np.random.seed(43)

    wind_speed          = np.random.uniform(30, 250, n)   # km/h
    pressure            = np.random.uniform(880, 1010, n) # hPa (lower = stronger)
    sea_surface_temp    = np.random.uniform(24, 32, n)    # celsius
    distance_from_coast = np.random.uniform(0, 2000, n)   # km
    humidity            = np.random.uniform(60, 100, n)   # %
    storm_surge         = np.random.uniform(0, 8, n)      # meters
    satellite_intensity = np.random.uniform(0, 10, n)     # 0-10 scale

    # Category 1-5 based on wind speed (Saffir-Simpson)
    def wind_to_cat(ws):
        if ws >= 209: return 5
        elif ws >= 178: return 4
        elif ws >= 154: return 3
        elif ws >= 119: return 2
        elif ws >= 63:  return 1
        else: return 0

    category = np.array([wind_to_cat(ws) for ws in wind_speed])

    # Risk score
    risk_score = (
        np.clip(wind_speed / 3, 0, 35) +
        np.clip((1010 - pressure) / 5, 0, 25) +
        np.clip((sea_surface_temp - 24) * 3, 0, 15) +
        np.clip((2000 - distance_from_coast) / 100, 0, 15) +
        np.clip(storm_surge * 2, 0, 10)
    )
    risk_score = np.clip(risk_score + np.random.normal(0, 5, n), 0, 100)

    # Landfall hours (estimated)
    landfall_hours = np.clip(distance_from_coast / 20 + np.random.normal(0, 5, n), 0, 120)

    df = pd.DataFrame({
        'wind_speed': wind_speed,
        'pressure': pressure,
        'sea_surface_temp': sea_surface_temp,
        'distance_from_coast': distance_from_coast,
        'humidity': humidity,
        'storm_surge': storm_surge,
        'satellite_intensity': satellite_intensity,
        'category': category,
        'risk_score': risk_score,
        'landfall_hours': landfall_hours,
    })
    return df

def train_cyclone_model():
    print("🌀 Training Cyclone Risk Model...")
    df = generate_cyclone_data(5000)

    features = ['wind_speed', 'pressure', 'sea_surface_temp', 'distance_from_coast',
                'humidity', 'storm_surge', 'satellite_intensity']
    X = df[features]
    y_class = df['category']
    y_reg   = df['risk_score']
    y_lf    = df['landfall_hours']

    X_train, X_test, yc_train, yc_test, yr_train, yr_test, yl_train, yl_test = train_test_split(
        X, y_class, y_reg, y_lf, test_size=0.2, random_state=42
    )

    # Category classifier
    clf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(n_estimators=150, random_state=42, n_jobs=-1)),
    ])
    clf_pipeline.fit(X_train, yc_train)
    clf_acc = clf_pipeline.score(X_test, yc_test)

    # Risk score regressor
    reg_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('reg', RandomForestRegressor(n_estimators=100, random_state=42)),
    ])
    reg_pipeline.fit(X_train, yr_train)

    # Landfall time regressor
    lf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('reg', RandomForestRegressor(n_estimators=100, random_state=42)),
    ])
    lf_pipeline.fit(X_train, yl_train)

    os.makedirs('models', exist_ok=True)
    joblib.dump(clf_pipeline, 'models/cyclone_classifier.pkl')
    joblib.dump(reg_pipeline, 'models/cyclone_regressor.pkl')
    joblib.dump(lf_pipeline,  'models/cyclone_landfall.pkl')
    joblib.dump(features,     'models/cyclone_features.pkl')

    print(f"   ✅ Category Accuracy   : {clf_acc:.2%}")
    print(f"   ✅ Models saved to models/cyclone_*.pkl")
    return clf_pipeline, reg_pipeline, lf_pipeline

if __name__ == '__main__':
    train_cyclone_model()
