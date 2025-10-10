def run_uhi_model(satellite_data):
    # Dummy: return geoJSON hotspots
    return {
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "geometry": {"type": "Point", "coordinates": [72.8777, 19.0760]}, "properties": {"hotspot": True}}
        ]
    }
