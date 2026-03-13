"""
Model Loader — loads all trained .pkl models once at startup
"""
import joblib
import os
import sys

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')

_models = {}

def load_all_models():
    """Load all disaster prediction models into memory."""
    global _models

    model_files = {
        'flood_clf':        'flood_classifier.pkl',
        'flood_reg':        'flood_regressor.pkl',
        'flood_features':   'flood_features.pkl',
        'cyclone_clf':      'cyclone_classifier.pkl',
        'cyclone_reg':      'cyclone_regressor.pkl',
        'cyclone_landfall': 'cyclone_landfall.pkl',
        'cyclone_features': 'cyclone_features.pkl',
        'landslide_clf':    'landslide_classifier.pkl',
        'landslide_reg':    'landslide_regressor.pkl',
        'landslide_features':'landslide_features.pkl',
        'heatwave_clf':     'heatwave_classifier.pkl',
        'heatwave_reg':     'heatwave_regressor.pkl',
        'heatwave_features':'heatwave_features.pkl',
    }

    loaded = []
    missing = []

    for key, filename in model_files.items():
        path = os.path.join(MODELS_DIR, filename)
        if os.path.exists(path):
            _models[key] = joblib.load(path)
            loaded.append(key)
        else:
            missing.append(filename)

    if missing:
        print(f"⚠️  Missing models: {missing}")
        print("   Run: python train_all.py")
    else:
        print(f"✅ All {len(loaded)} model files loaded successfully")

    return _models

def get_model(key):
    return _models.get(key)

def models_ready():
    required = ['flood_clf', 'cyclone_clf', 'landslide_clf', 'heatwave_clf']
    return all(k in _models for k in required)
