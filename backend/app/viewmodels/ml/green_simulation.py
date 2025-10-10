def detect_hotspots(city: str = "Mumbai"):
    # Dummy: returns list of heat pockets
    return [
        {"zone": "Andheri Industrial Belt", "temp": 41.2, "type": "industrial"},
        {"zone": "Bandra Traffic Hub", "temp": 39.8, "type": "traffic"},
        {"zone": "Lower Parel Concrete Zone", "temp": 40.5, "type": "dense_concrete"}
    ]

def simulate_green_interventions(hotspots, trees=100, reflective_paint=True, green_roofs=True):
    # Dummy: runs what-if simulation
    results = []
    for spot in hotspots:
        cooling = 0.0
        co2_reduction = 0.0
        if trees:
            cooling += 1.5
            co2_reduction += trees * 22  # kg/year
        if reflective_paint:
            cooling += 0.8
        if green_roofs:
            cooling += 1.2
        results.append({
            "zone": spot["zone"],
            "original_temp": spot["temp"],
            "simulated_temp": spot["temp"] - cooling,
            "co2_reduction": co2_reduction,
            "interventions": {
                "trees": trees,
                "reflective_paint": reflective_paint,
                "green_roofs": green_roofs
            }
        })
    return results

def control_cooling_system(zone: str, activate: bool):
    # Dummy: returns activation status
    return {
        "zone": zone,
        "system": "misting/fogging",
        "activated": activate
    }
