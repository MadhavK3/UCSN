import random
import math

from app.viewmodels.ingestion.openweather import fetch_weather_by_coords
import os

def detect_hotspots(city: str = "Mumbai", lat: float = 19.0760, lon: float = 72.8777):
    # Fetch real weather if possible to set base temp
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_temp = 35.0 # Default fallback
    
    if api_key:
        # Try to get weather for the coordinates
        weather = fetch_weather_by_coords(lat, lon, api_key)
        if weather and "main" in weather:
            base_temp = weather["main"]["temp"] - 273.15
            
    # Generate hotspots relative to base temp
    # Add deterministic offsets for visualization
    return [
        {
            "zone": "Detected High-Density Cluster A", 
            "temp": round(base_temp + 4.2, 1), 
            "type": "industrial",
            "lat": lat + 0.015,
            "lon": lon + 0.010
        },
        {
            "zone": "Detected Traffic Corridor B", 
            "temp": round(base_temp + 2.8, 1), 
            "type": "traffic",
            "lat": lat - 0.008,
            "lon": lon - 0.012
        },
        {
            "zone": "Detected Urban Core C", 
            "temp": round(base_temp + 3.5, 1), 
            "type": "dense_concrete",
            "lat": lat + 0.005,
            "lon": lon - 0.005
        }
    ]

def generate_geo_recommendations(center_lat=19.0760, center_lon=72.8777, trees=100, reflective_paint=True, green_roofs=True, coastal_barriers=False):
    """
    Generates specific lat/lon coordinates for recommended interventions.
    Uses a deterministic seed based on input parameters to simulate a consistent
    CNN-based analysis of the terrain features.
    """
    recommendations = []
    
    # Create a deterministic seed based on the input parameters
    # This ensures that for the same location and parameters, the "AI" always finds the same "optimal" spots.
    seed_str = f"{center_lat}_{center_lon}_{trees}_{reflective_paint}_{green_roofs}_{coastal_barriers}"
    rng = random.Random(seed_str)
    
    # Helper to generate deterministic point around center
    def deterministic_point(lat, lon, radius_km=5):
        radius_deg = radius_km / 111.0
        # Use the seeded rng instead of global random
        r = radius_deg * math.sqrt(rng.random())
        theta = rng.random() * 2 * math.pi
        return {
            "lat": lat + r * math.cos(theta),
            "lon": lon + r * math.sin(theta)
        }

    # 1. Tree Plantations (Green)
    # Simulating CNN identification of "permeable surfaces" and "heat islands"
    # The algorithm clusters trees in areas that would maximize cooling index.
    num_clusters = max(1, trees // 20)
    for _ in range(num_clusters):
        # Identify a "zone" suitable for planting
        cluster_center = deterministic_point(center_lat, center_lon, radius_km=4)
        cluster_size = min(20, trees)
        for _ in range(cluster_size):
            pt = deterministic_point(cluster_center["lat"], cluster_center["lon"], radius_km=0.5)
            recommendations.append({
                "type": "tree",
                "lat": pt["lat"],
                "lon": pt["lon"],
                "description": "CNN-Identified Planting Zone (High Impact)"
            })
            
    # 2. Reflective Paint (Yellow/White)
    # Simulating identification of "dark roof clusters" via satellite imagery
    if reflective_paint:
        for _ in range(15):
            pt = deterministic_point(center_lat, center_lon, radius_km=3)
            recommendations.append({
                "type": "paint",
                "lat": pt["lat"],
                "lon": pt["lon"],
                "description": "High Albedo Surface Target"
            })

    # 3. Green Roofs (Dark Green)
    # Simulating structural analysis for load-bearing capacity
    if green_roofs:
        for _ in range(10):
            pt = deterministic_point(center_lat, center_lon, radius_km=3)
            recommendations.append({
                "type": "roof",
                "lat": pt["lat"],
                "lon": pt["lon"],
                "description": "Structural Green Roof Zone"
            })

    # 4. Coastal Barriers (Blue)
    # Simulating bathymetry and surge risk analysis
    if coastal_barriers:
        # Approximate coastline for Mumbai (West side)
        base_lat = center_lat - 0.05
        base_lon = center_lon - 0.08 # Shift west
        for i in range(5):
            # Add slight deterministic jitter
            jitter = rng.uniform(-0.005, 0.005)
            recommendations.append({
                "type": "barrier",
                "lat": base_lat + (i * 0.02),
                "lon": base_lon + jitter,
                "description": "Critical Surge Protection Point"
            })

    return recommendations

def simulate_green_interventions(hotspots, trees=100, reflective_paint=True, green_roofs=True, coastal_barriers=False, lat=19.0760, lon=72.8777):
    # Dummy: runs what-if simulation
    results = []
    
    # Generate map points
    # Using provided lat/lon as center
    map_points = generate_geo_recommendations(lat, lon, trees, reflective_paint, green_roofs, coastal_barriers)
    
    for spot in hotspots:
        cooling = 0.0
        co2_reduction = 0.0
        if trees > 0:
            cooling += 1.5 * (trees / 100) # Scale effect
            co2_reduction += trees * 22  # kg/year
        if reflective_paint:
            cooling += 0.8
        if green_roofs:
            cooling += 1.2
        if coastal_barriers:
            cooling += 0.1 # Minor cooling, mostly protection
            
        results.append({
            "zone": spot["zone"],
            "original_temp": spot["temp"],
            "simulated_temp": round(spot["temp"] - cooling, 1),
            "co2_reduction": round(co2_reduction, 1),
            "interventions": {
                "trees": trees,
                "reflective_paint": reflective_paint,
                "green_roofs": green_roofs,
                "coastal_barriers": coastal_barriers
            }
        })
        
    return {
        "impact_stats": results,
        "map_points": map_points
    }

def control_cooling_system(zone: str, activate: bool):
    # Dummy: returns activation status
    return {
        "zone": zone,
        "system": "misting/fogging",
        "activated": activate
    }
