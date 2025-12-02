"""
Virtual Sensor Simulation
Generates realistic sensor readings for PM2.5, AQI, temperature, CO₂, and flood risk
"""
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List

def generate_sensor_readings(zone_id: str, coordinates: Dict, base_aqi: float = 80, base_temp: float = 30.0) -> Dict:
    """
    Generate virtual sensor readings for a zone
    """
    # Add realistic noise/variation
    aqi_variation = np.random.normal(0, 5)
    temp_variation = np.random.normal(0, 0.5)
    
    sensor_aqi = max(0, min(500, base_aqi + aqi_variation))
    sensor_temp = max(20, min(45, base_temp + temp_variation))
    
    # Calculate PM2.5 from AQI
    pm25 = _aqi_to_pm25(sensor_aqi)
    
    # Calculate CO₂ (correlated with traffic/industry)
    co2 = 400 + (sensor_aqi - 50) * 0.5  # ppm
    
    # Calculate humidity (simulated)
    humidity = 50 + np.random.normal(0, 10)
    humidity = max(30, min(90, humidity))
    
    # Calculate wind speed (simulated)
    wind_speed = 3 + np.random.exponential(2)
    wind_speed = min(15, wind_speed)
    
    # Flood risk (based on time and location)
    flood_risk = _calculate_flood_risk(coordinates)
    
    return {
        "sensor_id": f"sensor_{zone_id}",
        "zone_id": zone_id,
        "coordinates": coordinates,
        "timestamp": datetime.now().isoformat(),
        "readings": {
            "aqi": round(sensor_aqi, 0),
            "pm25": round(pm25, 1),
            "pm10": round(pm25 * 1.5, 1),
            "temperature": round(sensor_temp, 1),
            "humidity": round(humidity, 1),
            "co2_ppm": round(co2, 1),
            "wind_speed_ms": round(wind_speed, 1),
            "wind_direction_deg": round(np.random.uniform(0, 360), 0),
            "pressure_hpa": round(1013 + np.random.normal(0, 5), 1)
        },
        "risk_indicators": {
            "flood_risk": flood_risk,
            "heat_risk": "High" if sensor_temp > 35 else "Medium" if sensor_temp > 32 else "Low",
            "air_quality_risk": "High" if sensor_aqi > 150 else "Medium" if sensor_aqi > 100 else "Low"
        },
        "status": "operational",
        "last_calibration": (datetime.now() - timedelta(days=30)).isoformat()
    }

def _aqi_to_pm25(aqi: float) -> float:
    """Convert AQI to PM2.5"""
    if aqi <= 50:
        return aqi * 0.5
    elif aqi <= 100:
        return 25 + (aqi - 50) * 0.5
    elif aqi <= 150:
        return 50 + (aqi - 100) * 0.5
    elif aqi <= 200:
        return 75 + (aqi - 150) * 0.5
    else:
        return 100 + (aqi - 200) * 0.5

def _calculate_flood_risk(coordinates: Dict) -> str:
    """Calculate flood risk based on location"""
    # Simplified: assume some areas are more flood-prone
    lat = coordinates.get("lat", 28.65)
    # Areas closer to certain coordinates might be more flood-prone
    if 28.65 <= lat <= 28.66:
        return "Medium"
    else:
        return "Low"

def generate_dynamic_heatmap(zones: List[Dict], sensors: List[Dict]) -> Dict:
    """
    Generate dynamic heatmap data for visualization
    """
    heatmap_points = []
    
    for sensor in sensors:
        readings = sensor.get("readings", {})
        aqi = readings.get("aqi", 80)
        temp = readings.get("temperature", 30.0)
        
        # Color coding based on AQI
        if aqi <= 50:
            color = "green"
        elif aqi <= 100:
            color = "yellow"
        elif aqi <= 150:
            color = "orange"
        elif aqi <= 200:
            color = "red"
        else:
            color = "purple"
        
        heatmap_points.append({
            "coordinates": sensor.get("coordinates"),
            "aqi": aqi,
            "temperature": temp,
            "intensity": aqi / 500.0,  # Normalized intensity
            "color": color,
            "radius": 0.3  # km
        })
    
    return {
        "timestamp": datetime.now().isoformat(),
        "points": heatmap_points,
        "legend": {
            "green": "Good (0-50)",
            "yellow": "Moderate (51-100)",
            "orange": "Unhealthy for Sensitive (101-150)",
            "red": "Unhealthy (151-200)",
            "purple": "Very Unhealthy (201+)"
        }
    }

def generate_wind_flow_simulation(zones: List[Dict], wind_speed: float = 5.0, wind_direction: float = 270) -> Dict:
    """
    Generate wind flow simulation for pollution dispersion
    """
    flow_vectors = []
    
    for zone in zones:
        # Calculate wind vector components
        wind_rad = np.radians(wind_direction)
        u = wind_speed * np.sin(wind_rad)  # East component
        v = wind_speed * np.cos(wind_rad)  # North component
        
        flow_vectors.append({
            "zone_id": zone["id"],
            "coordinates": zone.get("coordinates", {}),
            "wind_vector": {
                "u": round(u, 2),  # East component (m/s)
                "v": round(v, 2),  # North component (m/s)
                "speed": round(wind_speed, 2),
                "direction": round(wind_direction, 0)
            },
            "dispersion_rate": round(wind_speed * 0.1, 2)  # Simplified dispersion
        })
    
    return {
        "timestamp": datetime.now().isoformat(),
        "wind_speed_ms": wind_speed,
        "wind_direction_deg": wind_direction,
        "flow_vectors": flow_vectors
    }

