from app.viewmodels.ml.uhi import run_uhi_model
from app.viewmodels.ml.flood import run_flood_model
from app.viewmodels.ml.energy import run_energy_model
from app.viewmodels.ml.coastal import run_coastal_shield_simulation
from app.viewmodels.ml.green_simulation import detect_hotspots
from app.viewmodels.ingestion.openweather import fetch_weather, fetch_forecast
import random
import math
import os
from datetime import datetime

# Global simulation state to track active interventions and their energy impact
SIMULATION_STATE = {
    "extra_load": 0,
    "active_interventions": []
}

def get_command_hub_status(city: str = "Mumbai"):
    """
    Aggregates data from all subsystems to provide a unified city status.
    Uses REAL OpenWeatherMap data for analysis if available, falling back to realistic simulation.
    """
    now = datetime.now()
    hour = now.hour
    
    # Fetch Real Data
    api_key = os.getenv("OPENWEATHER_API_KEY")
    weather_data = fetch_weather(city, api_key)
    forecast_data = fetch_forecast(city, api_key)
    
    # 1. UHI Status (Real Data)
    if weather_data and "main" in weather_data:
        # Convert Kelvin to Celsius
        current_temp = weather_data["main"]["temp"] - 273.15
        humidity = weather_data["main"]["humidity"]
        avg_temp = current_temp
        
        # Estimate hotspots based on real temp
        # If it's hot (>30C), we assume more hotspots
        hotspots_count = int(max(2, (current_temp - 25) * 1.5)) if current_temp > 25 else 2
    else:
        # Fallback Simulation
        base_temp = 28.0
        temp_variation = 6.0 * math.sin((hour - 8) * math.pi / 12)
        avg_temp = base_temp + temp_variation + random.uniform(-0.5, 0.5)
        hotspots_count = int(5 + (avg_temp - 25) * 0.8)

    # 2. Flood Risk (Real Rain Data + Simulated Tide)
    tide_level = 1.0 + 1.5 * math.sin(hour * math.pi / 6)
    rainfall_1h = 0.0
    
    if weather_data and "rain" in weather_data:
        rainfall_1h = weather_data["rain"].get("1h", 0.0)
    
    flood_risk = "Low"
    if rainfall_1h > 10 or tide_level > 2.2:
        flood_risk = "Medium"
    if rainfall_1h > 30 or (tide_level > 2.4 and rainfall_1h > 5):
        flood_risk = "High"

    flood_status = {
        "risk": flood_risk,
        "details": {
            "rainfall": round(rainfall_1h, 1), # mm
            "tide": round(tide_level, 2) # meters
        }
    }
    
    # 3. Energy Status (Real Trend from Forecast)
    base_load = 4500 # MW
    trend = "Stable"
    
    if forecast_data and "list" in forecast_data:
        # Compare current temp with forecast temp in 3 hours
        try:
            next_forecast_temp = forecast_data["list"][0]["main"]["temp"] - 273.15
            if next_forecast_temp > avg_temp + 1:
                trend = "Rising" # Hotter -> More AC -> More Demand
            elif next_forecast_temp < avg_temp - 1:
                trend = "Falling"
        except:
            pass
            
    # Demand calculation based on real temp + ACTIVE INTERVENTIONS
    # Higher temp = Higher demand
    temp_factor = max(1.0, 1.0 + (avg_temp - 25) * 0.05) 
    
    # Add the extra load from triggered actions
    current_demand = (base_load * temp_factor) + SIMULATION_STATE["extra_load"] + random.randint(-50, 50)
    
    energy_status = {
        "forecast": {
            "peak_demand": int(current_demand),
            "trend": trend
        }
    }
    
    # 4. Coastal Status
    coastal_status = run_coastal_shield_simulation(tide_level=tide_level, storm_surge_risk=(flood_risk == "High"))
    
    # 5. Air Quality (Real Data if available, else simulated)
    # OWM has an Air Pollution API but we might not have it in fetch_weather. 
    # We'll simulate based on real visibility/weather conditions if possible.
    aqi = 80
    if weather_data and "visibility" in weather_data:
        vis = weather_data["visibility"] # meters
        if vis < 2000: aqi += 50 # Haze/Smog
        if vis < 1000: aqi += 80
        
    # Add traffic factor
    traffic_factor = 0
    if 8 <= hour <= 10 or 17 <= hour <= 20: traffic_factor = 40
    aqi += traffic_factor
    
    # Overall System Alert Level
    alert_level = "GREEN"
    if aqi > 200 or flood_status['risk'] == "High" or avg_temp > 40:
        alert_level = "RED"
    elif aqi > 150 or flood_status['risk'] == "Medium" or avg_temp > 35:
        alert_level = "YELLOW"
        
    return {
        "timestamp": now.isoformat(),
        "city": city,
        "alert_level": alert_level,
        "subsystems": {
            "uhi": {
                "average_temp": round(avg_temp, 1),
                "hotspots_count": hotspots_count
            },
            "flood": flood_status,
            "energy": energy_status,
            "coastal": coastal_status,
            "air_quality": {
                "aqi": aqi,
                "status": "Good" if aqi < 50 else "Moderate" if aqi < 100 else "Unhealthy"
            }
        },
        "active_interventions": SIMULATION_STATE["active_interventions"] if SIMULATION_STATE["active_interventions"] else [
            "Cooling Mists: Standby",
            "Coastal Barriers: Retracted",
            "Energy Grid: Balanced"
        ]
    }

def trigger_response(system: str, action: str, target: str):
    """
    Orchestrates a response action and updates the simulation state (Energy Load).
    """
    load_impact = 0
    
    if system == "Cooling":
        load_impact = 150 # MW
    elif system == "Flood":
        load_impact = 300 # MW (Heavy pumps/hydraulics)
    elif system == "Air":
        load_impact = 200 # MW (Large scale filtration)
        
    SIMULATION_STATE["extra_load"] += load_impact
    
    # Track intervention description
    intervention_desc = f"{system}: {action}"
    if intervention_desc not in SIMULATION_STATE["active_interventions"]:
        SIMULATION_STATE["active_interventions"].insert(0, intervention_desc)
        SIMULATION_STATE["active_interventions"] = SIMULATION_STATE["active_interventions"][:3] # Keep last 3
    
    return {
        "status": "Success",
        "message": f"Initiated {action} on {system} for {target}. Grid Load Impact: +{load_impact}MW",
        "timestamp": datetime.now().isoformat()
    }
