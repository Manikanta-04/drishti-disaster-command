from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class RiskLevel(str, Enum):
    LOW      = "Low"
    MEDIUM   = "Medium"
    HIGH     = "High"
    CRITICAL = "Critical"

# ─── Flood ────────────────────────────────────────────────
class FloodInput(BaseModel):
    rainfall:       float = Field(..., ge=0,   le=500,  description="Rainfall in mm/day")
    river_level:    float = Field(..., ge=0,   le=20,   description="River level in meters")
    soil_moisture:  float = Field(..., ge=0,   le=100,  description="Soil moisture %")
    temperature:    float = Field(..., ge=5,   le=55,   description="Temperature in °C")
    humidity:       float = Field(..., ge=0,   le=100,  description="Humidity %")
    wind_speed:     float = Field(..., ge=0,   le=200,  description="Wind speed km/h")
    days_of_rain:   int   = Field(..., ge=0,   le=60,   description="Consecutive rainy days")
    elevation:      float = Field(50.0, ge=0,  le=5000, description="Elevation in meters")

class FloodOutput(BaseModel):
    risk_score:   float
    risk_level:   RiskLevel
    confidence:   float
    action:       str
    factors:      dict

# ─── Cyclone ─────────────────────────────────────────────
class CycloneInput(BaseModel):
    wind_speed:          float = Field(..., ge=0,    le=350)
    pressure:            float = Field(..., ge=850,  le=1020)
    sea_surface_temp:    float = Field(..., ge=20,   le=35)
    distance_from_coast: float = Field(..., ge=0,    le=3000)
    humidity:            float = Field(..., ge=40,   le=100)
    storm_surge:         float = Field(0.0, ge=0,   le=15)
    satellite_intensity: float = Field(5.0, ge=0,   le=10)

class CycloneOutput(BaseModel):
    risk_score:     float
    risk_level:     RiskLevel
    category:       int
    landfall_hours: float
    confidence:     float
    action:         str

# ─── Landslide ────────────────────────────────────────────
class LandslideInput(BaseModel):
    rainfall:             float = Field(..., ge=0,   le=500)
    slope_angle:          float = Field(..., ge=0,   le=90)
    soil_type_index:      float = Field(5.0, ge=0,  le=10)
    vegetation_index:     float = Field(0.5, ge=0,  le=1)
    soil_moisture:        float = Field(..., ge=0,   le=100)
    earthquake_proximity: float = Field(200.0, ge=0, le=500)
    previous_landslides:  int   = Field(0, ge=0,    le=20)

class LandslideOutput(BaseModel):
    risk_score:   float
    risk_level:   RiskLevel
    probability:  float
    confidence:   float
    action:       str

# ─── Heatwave ─────────────────────────────────────────────
class HeatwaveInput(BaseModel):
    temperature:          float = Field(..., ge=25,  le=55)
    humidity:             float = Field(..., ge=5,   le=100)
    wind_speed:           float = Field(..., ge=0,   le=100)
    uv_index:             float = Field(5.0, ge=0,  le=13)
    consecutive_hot_days: int   = Field(..., ge=0,   le=30)
    dewpoint:             float = Field(20.0, ge=0, le=40)
    heat_index:           float = Field(None)

    def __init__(self, **data):
        if data.get('heat_index') is None:
            t = data.get('temperature', 35)
            h = data.get('humidity', 50)
            data['heat_index'] = -8.78 + 1.61*t + 2.34*h - 0.146*t*h/100
        super().__init__(**data)

class HeatwaveOutput(BaseModel):
    risk_score:     float
    risk_level:     RiskLevel
    heat_category:  str
    confidence:     float
    action:         str

# ─── Combined / Multi-hazard ──────────────────────────────
class MultiHazardInput(BaseModel):
    location_name: str
    rainfall:      float = 0
    temperature:   float = 30
    humidity:      float = 60
    wind_speed:    float = 20
    river_level:   float = 2
    soil_moisture: float = 50
    pressure:      float = 1010
    slope_angle:   float = 10

class HazardResult(BaseModel):
    risk_score: float
    risk_level: str

class MultiHazardOutput(BaseModel):
    location:      str
    flood:         HazardResult
    cyclone:       HazardResult
    landslide:     HazardResult
    heatwave:      HazardResult
    overall_risk:  str
    highest_threat: str
    recommendations: list[str]
