import numpy as np
from fastapi import APIRouter, HTTPException
from api.schemas import (
    FloodInput, FloodOutput,
    CycloneInput, CycloneOutput,
    LandslideInput, LandslideOutput,
    HeatwaveInput, HeatwaveOutput,
    MultiHazardInput, MultiHazardOutput,
    HazardResult, RiskLevel,
)
from utils.model_loader import get_model, models_ready

router = APIRouter(prefix="/predict", tags=["Predictions"])

# ── Helpers ─────────────────────────────────────────────────────────────────

def score_to_risk_level(score: float) -> RiskLevel:
    if score >= 75: return RiskLevel.CRITICAL
    elif score >= 55: return RiskLevel.HIGH
    elif score >= 30: return RiskLevel.MEDIUM
    else: return RiskLevel.LOW

def get_action(risk_level: RiskLevel, disaster_type: str) -> str:
    actions = {
        RiskLevel.CRITICAL: {
            "flood":     "🚨 IMMEDIATE EVACUATION — Move to higher ground now",
            "cyclone":   "🚨 EMERGENCY EVACUATION — Move inland immediately",
            "landslide": "🚨 EVACUATE IMMEDIATELY — Leave slope area now",
            "heatwave":  "🚨 EXTREME HEAT EMERGENCY — Stay indoors, call for help",
        },
        RiskLevel.HIGH: {
            "flood":     "⚠️ Prepare for evacuation, monitor water levels",
            "cyclone":   "⚠️ Secure property, prepare emergency kit, stay alert",
            "landslide": "⚠️ Avoid slopes, monitor for ground movement",
            "heatwave":  "⚠️ Stay indoors between 11AM–4PM, stay hydrated",
        },
        RiskLevel.MEDIUM: {
            "flood":     "📢 Stay alert, avoid low-lying areas",
            "cyclone":   "📢 Monitor weather updates, prepare supplies",
            "landslide": "📢 Watch for warning signs, avoid saturated slopes",
            "heatwave":  "📢 Drink water regularly, avoid outdoor exertion",
        },
        RiskLevel.LOW: {
            "flood":     "✅ Normal conditions, continue monitoring",
            "cyclone":   "✅ No immediate threat, stay informed",
            "landslide": "✅ Low risk, normal precautions apply",
            "heatwave":  "✅ Normal conditions, standard sun safety",
        },
    }
    return actions.get(risk_level, {}).get(disaster_type, "Monitor the situation")

# ── Flood ────────────────────────────────────────────────────────────────────

@router.post("/flood", response_model=FloodOutput)
def predict_flood(data: FloodInput):
    clf = get_model('flood_clf')
    reg = get_model('flood_reg')
    if not clf or not reg:
        raise HTTPException(503, "Flood models not loaded. Run train_all.py first.")

    features = ['rainfall', 'river_level', 'soil_moisture', 'temperature',
                'humidity', 'wind_speed', 'days_of_rain', 'elevation']
    X = np.array([[getattr(data, f) for f in features]])

    risk_score  = float(np.clip(reg.predict(X)[0], 0, 100))
    proba       = clf.predict_proba(X)[0]
    confidence  = float(np.max(proba))
    risk_level  = score_to_risk_level(risk_score)

    factors = {
        "rainfall_contribution":  round(min(data.rainfall / 2, 30), 1),
        "river_level_impact":     round(min(data.river_level * 3, 25), 1),
        "soil_saturation":        round(max(data.soil_moisture - 50, 0) / 2, 1),
        "elevation_risk":         round(max(50 - data.elevation, 0) / 10, 1),
    }

    return FloodOutput(
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        confidence=round(confidence, 3),
        action=get_action(risk_level, "flood"),
        factors=factors,
    )

# ── Cyclone ──────────────────────────────────────────────────────────────────

@router.post("/cyclone", response_model=CycloneOutput)
def predict_cyclone(data: CycloneInput):
    clf = get_model('cyclone_clf')
    reg = get_model('cyclone_reg')
    lf  = get_model('cyclone_landfall')
    if not clf or not reg:
        raise HTTPException(503, "Cyclone models not loaded.")

    features = ['wind_speed', 'pressure', 'sea_surface_temp', 'distance_from_coast',
                'humidity', 'storm_surge', 'satellite_intensity']
    X = np.array([[getattr(data, f) for f in features]])

    risk_score     = float(np.clip(reg.predict(X)[0], 0, 100))
    category       = int(clf.predict(X)[0])
    landfall_hours = float(np.clip(lf.predict(X)[0], 0, 120)) if lf else data.distance_from_coast / 20
    proba          = clf.predict_proba(X)[0]
    confidence     = float(np.max(proba))
    risk_level     = score_to_risk_level(risk_score)

    return CycloneOutput(
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        category=category,
        landfall_hours=round(landfall_hours, 1),
        confidence=round(confidence, 3),
        action=get_action(risk_level, "cyclone"),
    )

# ── Landslide ────────────────────────────────────────────────────────────────

@router.post("/landslide", response_model=LandslideOutput)
def predict_landslide(data: LandslideInput):
    clf = get_model('landslide_clf')
    reg = get_model('landslide_reg')
    if not clf or not reg:
        raise HTTPException(503, "Landslide models not loaded.")

    features = ['rainfall', 'slope_angle', 'soil_type_index', 'vegetation_index',
                'soil_moisture', 'earthquake_proximity', 'previous_landslides']
    X = np.array([[getattr(data, f) for f in features]])

    risk_score  = float(np.clip(reg.predict(X)[0], 0, 100))
    proba       = clf.predict_proba(X)[0]
    probability = float(proba[1]) if len(proba) > 1 else float(proba[0])
    confidence  = float(np.max(proba))
    risk_level  = score_to_risk_level(risk_score)

    return LandslideOutput(
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        probability=round(probability, 3),
        confidence=round(confidence, 3),
        action=get_action(risk_level, "landslide"),
    )

# ── Heatwave ─────────────────────────────────────────────────────────────────

@router.post("/heatwave", response_model=HeatwaveOutput)
def predict_heatwave(data: HeatwaveInput):
    clf = get_model('heatwave_clf')
    reg = get_model('heatwave_reg')
    if not clf or not reg:
        raise HTTPException(503, "Heatwave models not loaded.")

    features = ['temperature', 'humidity', 'wind_speed', 'uv_index',
                'consecutive_hot_days', 'dewpoint', 'heat_index']
    X = np.array([[getattr(data, f) for f in features]])

    risk_score   = float(np.clip(reg.predict(X)[0], 0, 100))
    cat_index    = int(clf.predict(X)[0])
    proba        = clf.predict_proba(X)[0]
    confidence   = float(np.max(proba))
    risk_level   = score_to_risk_level(risk_score)
    categories   = ["Normal", "Moderate", "Severe", "Extreme"]
    heat_category = categories[cat_index] if cat_index < len(categories) else "Extreme"

    return HeatwaveOutput(
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        heat_category=heat_category,
        confidence=round(confidence, 3),
        action=get_action(risk_level, "heatwave"),
    )

# ── Multi-Hazard ─────────────────────────────────────────────────────────────

@router.post("/multi-hazard", response_model=MultiHazardOutput)
def predict_multi_hazard(data: MultiHazardInput):
    results = {}

    # Flood
    try:
        fd = FloodInput(
            rainfall=data.rainfall, river_level=data.river_level,
            soil_moisture=data.soil_moisture, temperature=data.temperature,
            humidity=data.humidity, wind_speed=data.wind_speed,
            days_of_rain=3, elevation=50
        )
        fr = predict_flood(fd)
        results['flood'] = HazardResult(risk_score=fr.risk_score, risk_level=fr.risk_level.value)
    except Exception:
        results['flood'] = HazardResult(risk_score=0, risk_level="Low")

    # Cyclone
    try:
        cd = CycloneInput(
            wind_speed=data.wind_speed, pressure=data.pressure,
            sea_surface_temp=min(data.temperature, 32),
            distance_from_coast=500, humidity=data.humidity
        )
        cr = predict_cyclone(cd)
        results['cyclone'] = HazardResult(risk_score=cr.risk_score, risk_level=cr.risk_level.value)
    except Exception:
        results['cyclone'] = HazardResult(risk_score=0, risk_level="Low")

    # Landslide
    try:
        ld = LandslideInput(
            rainfall=data.rainfall, slope_angle=data.slope_angle,
            soil_moisture=data.soil_moisture,
        )
        lr = predict_landslide(ld)
        results['landslide'] = HazardResult(risk_score=lr.risk_score, risk_level=lr.risk_level.value)
    except Exception:
        results['landslide'] = HazardResult(risk_score=0, risk_level="Low")

    # Heatwave
    try:
        hd = HeatwaveInput(
            temperature=data.temperature, humidity=data.humidity,
            wind_speed=data.wind_speed, consecutive_hot_days=3,
        )
        hr = predict_heatwave(hd)
        results['heatwave'] = HazardResult(risk_score=hr.risk_score, risk_level=hr.risk_level.value)
    except Exception:
        results['heatwave'] = HazardResult(risk_score=0, risk_level="Low")

    # Overall risk
    scores = {k: v.risk_score for k, v in results.items()}
    highest = max(scores, key=scores.get)
    overall_score = max(scores.values())
    overall_risk = score_to_risk_level(overall_score).value

    # Recommendations
    recs = []
    if scores['flood'] >= 55:     recs.append("🌊 Flood evacuation plan activated")
    if scores['cyclone'] >= 55:   recs.append("🌀 Cyclone shelter-in-place advised")
    if scores['landslide'] >= 55: recs.append("⛰️ Avoid all slope areas")
    if scores['heatwave'] >= 55:  recs.append("🔥 Heat emergency protocols in effect")
    if not recs:                   recs.append("✅ No immediate multi-hazard threat")

    return MultiHazardOutput(
        location=data.location_name,
        flood=results['flood'],
        cyclone=results['cyclone'],
        landslide=results['landslide'],
        heatwave=results['heatwave'],
        overall_risk=overall_risk,
        highest_threat=highest,
        recommendations=recs,
    )
