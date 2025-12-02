from app.viewmodels.ml.green_simulation import detect_hotspots

def run_uhi_model(satellite_data, city="Mumbai"):
    # Get hotspots with coordinates
    # For now we default to Mumbai coords if not provided in satellite_data
    lat = 19.0760
    lon = 72.8777
    
    hotspots = detect_hotspots(city, lat, lon)
    
    features = []
    for spot in hotspots:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [spot["lon"], spot["lat"]]
            },
            "properties": {
                "hotspot": True,
                "zone": spot["zone"],
                "temp": spot["temp"],
                "type": spot["type"]
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }
