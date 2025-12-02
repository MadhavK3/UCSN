"""
Carbon Footprint Tracking and Offset Calculator
Calculates CO₂ emissions reduced by climate interventions
"""
import math
from datetime import datetime, timedelta

# Carbon sequestration rates (kg CO₂ per unit per year)
CARBON_RATES = {
    "tree": 22,  # kg CO₂ per tree per year
    "reflective_paint": 0.5,  # kg CO₂ per m² per year (reduced AC usage)
    "green_roof": 2.5,  # kg CO₂ per m² per year
    "coastal_barrier": 0.1,  # Indirect (mangrove protection)
    "cooling_mist": 15,  # kg CO₂ saved per zone (reduced AC demand)
    "air_purifier": 8,  # kg CO₂ per zone per year
}

# Energy to CO₂ conversion (kg CO₂ per kWh)
# India's grid emission factor (approximate)
GRID_EMISSION_FACTOR = 0.82  # kg CO₂ per kWh

def calculate_carbon_offset(interventions: dict) -> dict:
    """
    Calculate total carbon offset from interventions
    
    Args:
        interventions: {
            "trees": int,
            "reflective_paint_area": float (m²),
            "green_roof_area": float (m²),
            "coastal_barriers": int,
            "cooling_zones": int,
            "air_purifier_zones": int
        }
    
    Returns:
        {
            "total_co2_offset_kg": float,
            "total_co2_offset_tons": float,
            "breakdown": {...},
            "equivalent_trees": int,
            "equivalent_cars_removed": float,
            "carbon_credits": float
        }
    """
    breakdown = {}
    total_kg = 0.0
    
    # Trees
    if interventions.get("trees", 0) > 0:
        trees = interventions["trees"]
        co2_trees = trees * CARBON_RATES["tree"]
        breakdown["trees"] = {
            "count": trees,
            "co2_kg": co2_trees,
            "description": f"{trees} trees sequestering CO₂"
        }
        total_kg += co2_trees
    
    # Reflective Paint
    if interventions.get("reflective_paint_area", 0) > 0:
        area = interventions["reflective_paint_area"]
        co2_paint = area * CARBON_RATES["reflective_paint"]
        breakdown["reflective_paint"] = {
            "area_m2": area,
            "co2_kg": co2_paint,
            "description": f"{area:.0f} m² of reflective surfaces reducing AC demand"
        }
        total_kg += co2_paint
    
    # Green Roofs
    if interventions.get("green_roof_area", 0) > 0:
        area = interventions["green_roof_area"]
        co2_roofs = area * CARBON_RATES["green_roof"]
        breakdown["green_roofs"] = {
            "area_m2": area,
            "co2_kg": co2_roofs,
            "description": f"{area:.0f} m² of green roofs"
        }
        total_kg += co2_roofs
    
    # Coastal Barriers (indirect - mangrove protection)
    if interventions.get("coastal_barriers", 0) > 0:
        barriers = interventions["coastal_barriers"]
        co2_barriers = barriers * CARBON_RATES["coastal_barrier"] * 100  # Scale factor
        breakdown["coastal_barriers"] = {
            "count": barriers,
            "co2_kg": co2_barriers,
            "description": f"{barriers} barriers protecting mangrove ecosystems"
        }
        total_kg += co2_barriers
    
    # Cooling Systems
    if interventions.get("cooling_zones", 0) > 0:
        zones = interventions["cooling_zones"]
        co2_cooling = zones * CARBON_RATES["cooling_mist"]
        breakdown["cooling_systems"] = {
            "zones": zones,
            "co2_kg": co2_cooling,
            "description": f"{zones} cooling zones reducing AC demand"
        }
        total_kg += co2_cooling
    
    # Air Purifiers
    if interventions.get("air_purifier_zones", 0) > 0:
        zones = interventions["air_purifier_zones"]
        co2_air = zones * CARBON_RATES["air_purifier"]
        breakdown["air_purifiers"] = {
            "zones": zones,
            "co2_kg": co2_air,
            "description": f"{zones} air purification zones"
        }
        total_kg += co2_air
    
    # Energy Savings (if provided)
    if interventions.get("energy_saved_kwh", 0) > 0:
        kwh = interventions["energy_saved_kwh"]
        co2_energy = kwh * GRID_EMISSION_FACTOR
        breakdown["energy_savings"] = {
            "kwh": kwh,
            "co2_kg": co2_energy,
            "description": f"{kwh:.0f} kWh saved from grid"
        }
        total_kg += co2_energy
    
    # Convert to tons
    total_tons = total_kg / 1000.0
    
    # Equivalent metrics
    equivalent_trees = int(total_kg / CARBON_RATES["tree"]) if total_kg > 0 else 0
    # Average car emits ~4.6 tons CO₂ per year
    equivalent_cars = total_tons / 4.6
    
    # Carbon credits (1 credit = 1 ton CO₂)
    carbon_credits = total_tons
    
    return {
        "total_co2_offset_kg": round(total_kg, 2),
        "total_co2_offset_tons": round(total_tons, 2),
        "breakdown": breakdown,
        "equivalent_trees": equivalent_trees,
        "equivalent_cars_removed": round(equivalent_cars, 1),
        "carbon_credits": round(carbon_credits, 2),
        "timestamp": datetime.now().isoformat()
    }

def calculate_energy_carbon_savings(energy_saved_kwh: float) -> dict:
    """Calculate CO₂ saved from energy reduction"""
    co2_kg = energy_saved_kwh * GRID_EMISSION_FACTOR
    return {
        "energy_saved_kwh": energy_saved_kwh,
        "co2_saved_kg": round(co2_kg, 2),
        "co2_saved_tons": round(co2_kg / 1000.0, 3),
        "emission_factor": GRID_EMISSION_FACTOR
    }

