"""
Heatwave Risk Prediction Model
Input: temperature, humidity, wind_speed, uv_index, consecutive_hot_days,
       heat_index, dewpoint
Output: risk_score (0-100), heat_category
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def generate_heatwave_data(n=5000):
    np.random.seed(45)

    temperature          = np.random.uniform(28, 52, n)    # celsius
    humidity             = np.random.uniform(10, 90, n)    # %
    wind_speed           = np.random.uniform(0, 60, n)     # km/h
    uv_index             = np.random.uniform(0, 11, n)     # 0-11+
    consecutive_hot_days = np.random.randint(0, 20, n)     # days
    dewpoint             = temperature - np.random.uniform(5, 20, n)

    # Heat index approximation (Steadman)
    heat_index = (
        -8.78 +
        1.61 * temperature +
        2.34 * humidity -
        0.146 * temperature * humidity / 100 +
        np.random.normal(0, 2, n)
    )
    heat_index = np.clip(heat_index, temperature, temperature + 20)

    # Risk score
    risk_score = (
        np.clip((temperature - 35) * 2.5, 0, 35) +
        np.clip((heat_index - 38) * 1.5, 0, 20) +
        np.clip(consecutive_hot_days * 2, 0, 20) +
        np.clip(uv_index * 1.5, 0, 15) +
        np.clip((50 - wind_speed) / 10, 0, 10)
    )
    risk_score = np.clip(risk_score + np.random.normal(0, 5, n), 0, 100)

    # Heat category
    def cat(score):
        if score >= 75: return 3   # Extreme
        elif score >= 50: return 2 # Severe
        elif score >= 25: return 1 # Moderate
        else: return 0             # Normal

    heat_category = np.array([cat(s) for s in risk_score])

    df = pd.DataFrame({
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'uv_index': uv_index,
        'consecutive_hot_days': consecutive_hot_days,
        'dewpoint': dewpoint,
        'heat_index': heat_index,
        'risk_score': risk_score,
        'heat_category': heat_category,
    })
    return df

def train_heatwave_model():
    print("🔥 Training Heatwave Risk Model...")
    df = generate_heatwave_data(5000)

    features = ['temperature', 'humidity', 'wind_speed', 'uv_index',
                'consecutive_hot_days', 'dewpoint', 'heat_index']
    X = df[features]
    y_class = df['heat_category']
    y_reg   = df['risk_score']

    X_train, X_test, yc_train, yc_test, yr_train, yr_test = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42
    )

    clf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)),
    ])
    clf_pipeline.fit(X_train, yc_train)
    clf_acc = clf_pipeline.score(X_test, yc_test)

    reg_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('reg', RandomForestRegressor(n_estimators=100, random_state=42)),
    ])
    reg_pipeline.fit(X_train, yr_train)

    os.makedirs('models', exist_ok=True)
    joblib.dump(clf_pipeline, 'models/heatwave_classifier.pkl')
    joblib.dump(reg_pipeline, 'models/heatwave_regressor.pkl')
    joblib.dump(features,     'models/heatwave_features.pkl')

    print(f"   ✅ Classifier Accuracy : {clf_acc:.2%}")
    print(f"   ✅ Models saved to models/heatwave_*.pkl")
    return clf_pipeline, reg_pipeline

if __name__ == '__main__':
    train_heatwave_model()
