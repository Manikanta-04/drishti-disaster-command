"""
Train ALL disaster prediction models in one shot.
Run this once before starting the ML service.

Usage:
    python train_all.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))

from training.flood_train     import train_flood_model
from training.cyclone_train   import train_cyclone_model
from training.landslide_train import train_landslide_model
from training.heatwave_train  import train_heatwave_model

def train_all():
    print("=" * 55)
    print("  DRISHTI — Disaster Prediction Model Training")
    print("=" * 55)
    start = time.time()

    os.makedirs('models', exist_ok=True)

    print("\n[1/4]", end=" ")
    train_flood_model()

    print("\n[2/4]", end=" ")
    train_cyclone_model()

    print("\n[3/4]", end=" ")
    train_landslide_model()

    print("\n[4/4]", end=" ")
    train_heatwave_model()

    elapsed = time.time() - start
    print("\n" + "=" * 55)
    print(f"  ✅ All models trained in {elapsed:.1f} seconds")
    print(f"  📁 Saved to: {os.path.abspath('models')}/")
    print("=" * 55)
    print("\n  Now start the API server:")
    print("  > python app.py")
    print("=" * 55)

if __name__ == '__main__':
    train_all()
