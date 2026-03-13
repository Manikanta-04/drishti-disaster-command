"""
DRISHTI — ML Prediction Service
"""

import os
import sys
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.routes import router as predict_router
from utils.model_loader import load_all_models, models_ready

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n🚀 DRISHTI ML Service starting...")
    load_all_models()
    if not models_ready():
        print("⚠️  Some models missing — run: python train_all.py")
    else:
        print("✅ All prediction models ready\n")
    yield
    print("🛑 ML Service shutting down...")

app = FastAPI(
    title="DRISHTI Disaster ML Service",
    description="AI-powered disaster risk prediction for floods, cyclones, landslides and heatwaves",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)

@app.get("/", tags=["Health"])
def root():
    return {
        "service": "DRISHTI ML Prediction API",
        "status": "running",
        "models_ready": models_ready(),
        "endpoints": [
            "POST /predict/flood",
            "POST /predict/cyclone",
            "POST /predict/landslide",
            "POST /predict/heatwave",
            "POST /predict/multi-hazard",
        ],
        "docs": "http://localhost:8000/docs",
    }

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy" if models_ready() else "degraded",
        "models_loaded": models_ready(),
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
