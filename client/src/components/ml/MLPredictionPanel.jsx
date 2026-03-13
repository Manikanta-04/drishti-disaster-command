import { useState } from 'react';
import { Brain, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const ML_API = 'http://localhost:8000';

const severityColor = {
  Low:      { text: '#3bff8a', bg: 'rgba(59,255,138,0.08)',  border: 'rgba(59,255,138,0.25)'  },
  Medium:   { text: '#ffcb3b', bg: 'rgba(255,203,59,0.08)',  border: 'rgba(255,203,59,0.25)'  },
  High:     { text: '#ff7b3b', bg: 'rgba(255,123,59,0.08)',  border: 'rgba(255,123,59,0.25)'  },
  Critical: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.08)',   border: 'rgba(255,59,59,0.25)'   },
};

const disasterTypes = [
  { key: 'flood',     label: '🌊 Flood',     color: '#3b9eff' },
  { key: 'cyclone',   label: '🌀 Cyclone',   color: '#00e5ff' },
  { key: 'landslide', label: '⛰️ Landslide', color: '#ffcb3b' },
  { key: 'heatwave',  label: '🔥 Heatwave',  color: '#ff7b3b' },
  { key: 'multi',     label: '🌍 Multi',     color: '#3bff8a' },
];

const defaultInputs = {
  flood:     { rainfall: 80, river_level: 8, soil_moisture: 75, temperature: 28, humidity: 90, wind_speed: 40, days_of_rain: 5, elevation: 30 },
  cyclone:   { wind_speed: 150, pressure: 950, sea_surface_temp: 29, distance_from_coast: 300, humidity: 88, storm_surge: 3, satellite_intensity: 7 },
  landslide: { rainfall: 120, slope_angle: 35, soil_type_index: 6, vegetation_index: 0.3, soil_moisture: 80, earthquake_proximity: 50, previous_landslides: 2 },
  heatwave:  { temperature: 44, humidity: 25, wind_speed: 15, uv_index: 9, consecutive_hot_days: 7, dewpoint: 28 },
  multi:     { location_name: 'Kerala Coast', rainfall: 80, temperature: 38, humidity: 75, wind_speed: 60, river_level: 6, soil_moisture: 70, pressure: 980, slope_angle: 25 },
};

const inputLabels = {
  rainfall: 'Rainfall (mm)', river_level: 'River Level (m)', soil_moisture: 'Soil Moisture (%)',
  temperature: 'Temperature (°C)', humidity: 'Humidity (%)', wind_speed: 'Wind Speed (km/h)',
  days_of_rain: 'Days of Rain', elevation: 'Elevation (m)', pressure: 'Pressure (hPa)',
  sea_surface_temp: 'Sea Temp (°C)', distance_from_coast: 'Dist. Coast (km)',
  storm_surge: 'Storm Surge (m)', satellite_intensity: 'Sat. Intensity',
  slope_angle: 'Slope Angle (°)', soil_type_index: 'Soil Type Index', vegetation_index: 'Vegetation Index',
  earthquake_proximity: 'EQ Proximity (km)', previous_landslides: 'Prev. Landslides',
  uv_index: 'UV Index', consecutive_hot_days: 'Hot Days (streak)', dewpoint: 'Dewpoint (°C)',
  location_name: 'Location Name',
};

const MLPredictionPanel = () => {
  const [activeType, setActiveType]   = useState('flood');
  const [inputs, setInputs]           = useState(defaultInputs);
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [showInputs, setShowInputs]   = useState(true);

  const handlePredict = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const endpoint = activeType === 'multi' ? '/predict/multi-hazard' : `/predict/${activeType}`;
      const res = await axios.post(`${ML_API}${endpoint}`, inputs[activeType]);
      setResult(res.data);
      setShowInputs(false);
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'ML service unreachable. Is port 8000 running?');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#050a0e', border: '1px solid #1a3a52',
    borderRadius: '4px', padding: '5px 8px', color: '#e8f4f8',
    fontSize: '12px', outline: 'none', fontFamily: 'Exo 2, sans-serif',
  };

  const currentInputs = inputs[activeType] || {};
  const riskLevel = result?.risk_level || result?.overall_risk;
  const c = severityColor[riskLevel] || severityColor.Low;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} style={{ color: '#00e5ff' }} />
        <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>AI RISK PREDICTOR</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded font-mono-custom"
          style={{ background: 'rgba(0,229,255,0.08)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' }}>
          ML POWERED
        </span>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {disasterTypes.map(d => (
          <button key={d.key} onClick={() => { setActiveType(d.key); setResult(null); setShowInputs(true); }}
            className="text-xs px-2.5 py-1 rounded font-display font-semibold transition-all"
            style={{
              background: activeType === d.key ? `${d.color}18` : 'transparent',
              color: activeType === d.key ? d.color : '#7aa3bc',
              border: `1px solid ${activeType === d.key ? d.color + '50' : '#1a3a52'}`,
            }}>
            {d.label}
          </button>
        ))}
      </div>

      {/* Inputs toggle */}
      <button onClick={() => setShowInputs(p => !p)} className="flex items-center gap-2 w-full text-left mb-3" style={{ color: '#7aa3bc' }}>
        <span className="text-xs font-display font-semibold" style={{ letterSpacing: '0.05em' }}>INPUT PARAMETERS</span>
        {showInputs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showInputs && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(currentInputs).map(([key, val]) => (
            <div key={key}>
              <div className="text-xs mb-0.5" style={{ color: '#3d6477' }}>{inputLabels[key] || key}</div>
              <input type={typeof val === 'string' ? 'text' : 'number'} style={inputStyle}
                value={val} step={key === 'vegetation_index' ? '0.1' : '1'}
                onChange={e => setInputs(prev => ({
                  ...prev,
                  [activeType]: { ...prev[activeType], [key]: typeof val === 'string' ? e.target.value : Number(e.target.value) }
                }))} />
            </div>
          ))}
        </div>
      )}

      {/* Predict button */}
      <button onClick={handlePredict} disabled={loading}
        className="w-full py-2.5 rounded font-display font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        style={{ background: loading ? '#1a3a52' : 'linear-gradient(135deg, #00e5ff, #3b9eff)', color: '#050a0e' }}>
        {loading
          ? <><div className="w-4 h-4 rounded-full border-2 border-transparent" style={{ borderTopColor: '#050a0e', animation: 'spin 0.8s linear infinite' }} />PREDICTING...</>
          : <><Zap size={14} />RUN PREDICTION</>}
      </button>

      {error && (
        <div className="mt-3 p-3 rounded text-xs" style={{ background: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.3)', color: '#ff3b3b' }}>
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-4 p-3 rounded animate-slide-up" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-sm" style={{ color: c.text }}>PREDICTION RESULT</span>
            <span className="font-mono-custom font-bold px-2 py-0.5 rounded text-xs"
              style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
              {riskLevel?.toUpperCase()}
            </span>
          </div>

          {result.risk_score !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: '#7aa3bc' }}>
                <span>Risk Score</span>
                <span style={{ color: c.text, fontWeight: 700 }}>{result.risk_score.toFixed(1)} / 100</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#1a3a52' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${result.risk_score}%`, background: c.text }} />
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-xs">
            {result.confidence   !== undefined && <div className="flex justify-between"><span style={{ color: '#7aa3bc' }}>Confidence</span><span style={{ color: '#e8f4f8' }}>{(result.confidence * 100).toFixed(1)}%</span></div>}
            {result.category     !== undefined && <div className="flex justify-between"><span style={{ color: '#7aa3bc' }}>Cyclone Category</span><span style={{ color: '#e8f4f8' }}>Cat {result.category}</span></div>}
            {result.landfall_hours !== undefined && <div className="flex justify-between"><span style={{ color: '#7aa3bc' }}>Landfall ETA</span><span style={{ color: '#e8f4f8' }}>{result.landfall_hours.toFixed(1)} hrs</span></div>}
            {result.probability  !== undefined && <div className="flex justify-between"><span style={{ color: '#7aa3bc' }}>Occurrence Probability</span><span style={{ color: '#e8f4f8' }}>{(result.probability * 100).toFixed(1)}%</span></div>}
            {result.heat_category && <div className="flex justify-between"><span style={{ color: '#7aa3bc' }}>Heat Category</span><span style={{ color: '#e8f4f8' }}>{result.heat_category}</span></div>}
            {result.highest_threat && <div className="flex justify-between"><span style={{ color: '#7aa3bc' }}>Highest Threat</span><span style={{ color: c.text, fontWeight: 700 }}>{result.highest_threat.toUpperCase()}</span></div>}
          </div>

          {result.action && (
            <div className="mt-3 p-2 rounded text-xs" style={{ background: 'rgba(0,0,0,0.3)', color: '#e8f4f8', lineHeight: 1.6 }}>
              {result.action}
            </div>
          )}

          {/* Multi-hazard bars */}
          {result.flood && (
            <div className="mt-3 space-y-1.5">
              <div className="text-xs font-display font-bold mb-1" style={{ color: '#7aa3bc', letterSpacing: '0.1em' }}>HAZARD BREAKDOWN</div>
              {['flood','cyclone','landslide','heatwave'].map(h => {
                const hd = result[h];
                const hc = severityColor[hd?.risk_level] || severityColor.Low;
                return (
                  <div key={h} className="flex items-center gap-2">
                    <span className="text-xs w-16 capitalize" style={{ color: '#7aa3bc' }}>{h}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1a3a52' }}>
                      <div className="h-full rounded-full" style={{ width: `${hd?.risk_score || 0}%`, background: hc.text }} />
                    </div>
                    <span className="text-xs font-mono-custom w-10 text-right" style={{ color: hc.text }}>{hd?.risk_score?.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          )}

          {result.recommendations?.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.recommendations.map((r, i) => (
                <div key={i} className="text-xs p-1.5 rounded" style={{ background: 'rgba(0,0,0,0.2)', color: '#e8f4f8' }}>{r}</div>
              ))}
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MLPredictionPanel;
