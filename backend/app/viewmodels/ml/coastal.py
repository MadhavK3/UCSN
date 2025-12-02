import random

def run_coastal_shield_simulation(tide_level: float = 1.0, storm_surge_risk: bool = False):
    """
    Simulates the status of Smart Coastal Shields.
    """
    
    # Logic: If tide is high or storm surge risk is present, barriers should be active.
    barriers_active = False
    if tide_level > 2.5 or storm_surge_risk:
        barriers_active = True
        
    # Wave Energy Calculation (dummy physics)
    # Higher tide/storm usually means more wave energy potential
    wave_energy_generated = 0.0
    if storm_surge_risk:
        wave_energy_generated = random.uniform(5.0, 12.0) # MW
    else:
        wave_energy_generated = random.uniform(0.5, 2.0) # MW
        
    erosion_control_status = "Stable"
    if storm_surge_risk:
        erosion_control_status = "Active Stabilization"
        
    return {
        "barriers_active": barriers_active,
        "wave_energy_generated_mw": round(wave_energy_generated, 2),
        "erosion_control_status": erosion_control_status,
        "details": {
            "tide_level": tide_level,
            "storm_surge_risk": storm_surge_risk,
            "mangrove_health_index": 0.85 # 0 to 1
        }
    }

def get_wave_energy_status():
    return {
        "current_output_mw": round(random.uniform(0.8, 3.5), 2),
        "efficiency": "92%",
        "status": "Operational"
    }
