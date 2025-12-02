"""
AI-Powered Cost-Benefit Analysis for Climate Interventions
Calculates ROI, payback period, and optimal intervention mix
"""
from typing import List, Dict
import math
from datetime import datetime

# Cost data (in USD, can be converted to INR)
INTERVENTION_COSTS = {
    "tree": {
        "installation": 50,  # USD per tree
        "maintenance_per_year": 5,
        "lifespan_years": 30,
        "co2_per_year": 22,  # kg
        "energy_saved_kwh_per_year": 0,  # Trees don't directly save energy
        "temp_reduction_c": 0.1  # Per tree in cluster
    },
    "reflective_paint": {
        "installation": 15,  # USD per m²
        "maintenance_per_year": 2,
        "lifespan_years": 10,
        "co2_per_year": 0.5,  # kg per m²
        "energy_saved_kwh_per_year": 2.5,  # Per m²
        "temp_reduction_c": 0.05  # Per m²
    },
    "green_roof": {
        "installation": 120,  # USD per m²
        "maintenance_per_year": 10,
        "lifespan_years": 25,
        "co2_per_year": 2.5,  # kg per m²
        "energy_saved_kwh_per_year": 15,  # Per m²
        "temp_reduction_c": 0.2  # Per m²
    },
    "coastal_barrier": {
        "installation": 5000,  # USD per barrier unit
        "maintenance_per_year": 200,
        "lifespan_years": 50,
        "co2_per_year": 10,  # Indirect
        "energy_saved_kwh_per_year": 0,
        "temp_reduction_c": 0.01
    },
    "cooling_mist": {
        "installation": 8000,  # USD per zone
        "maintenance_per_year": 500,
        "lifespan_years": 15,
        "co2_per_year": 15,  # kg saved
        "energy_saved_kwh_per_year": 200,  # Reduced AC usage
        "temp_reduction_c": 2.0  # Per zone
    }
}

# Economic factors
ENERGY_COST_PER_KWH = 0.12  # USD per kWh
CARBON_CREDIT_PRICE = 15  # USD per ton CO₂
DISCOUNT_RATE = 0.05  # 5% annual discount rate

def calculate_intervention_cba(intervention_type: str, quantity: float, area: float = None) -> Dict:
    """
    Calculate cost-benefit analysis for a single intervention type
    
    Args:
        intervention_type: "tree", "reflective_paint", "green_roof", etc.
        quantity: Number of units
        area: Area in m² (for area-based interventions)
    
    Returns:
        Cost-benefit analysis dictionary
    """
    if intervention_type not in INTERVENTION_COSTS:
        return {"error": f"Unknown intervention type: {intervention_type}"}
    
    cost_data = INTERVENTION_COSTS[intervention_type]
    
    # Determine actual quantity (use area for area-based, quantity for count-based)
    if area:
        actual_quantity = area
    else:
        actual_quantity = quantity
    
    # Initial investment
    initial_cost = cost_data["installation"] * actual_quantity
    
    # Annual benefits
    annual_co2_kg = cost_data["co2_per_year"] * actual_quantity
    annual_energy_kwh = cost_data["energy_saved_kwh_per_year"] * actual_quantity
    annual_energy_savings_usd = annual_energy_kwh * ENERGY_COST_PER_KWH
    annual_carbon_credits_usd = (annual_co2_kg / 1000.0) * CARBON_CREDIT_PRICE
    
    # Annual costs
    annual_maintenance = cost_data["maintenance_per_year"] * actual_quantity
    
    # Net annual benefit
    net_annual_benefit = annual_energy_savings_usd + annual_carbon_credits_usd - annual_maintenance
    
    # Calculate NPV over lifespan
    lifespan = cost_data["lifespan_years"]
    npv = -initial_cost
    for year in range(1, lifespan + 1):
        discounted_benefit = net_annual_benefit / ((1 + DISCOUNT_RATE) ** year)
        npv += discounted_benefit
    
    # ROI (Return on Investment)
    total_benefits = sum(net_annual_benefit / ((1 + DISCOUNT_RATE) ** year) for year in range(1, lifespan + 1))
    roi_percent = ((total_benefits - initial_cost) / initial_cost) * 100 if initial_cost > 0 else 0
    
    # Payback period (years)
    if net_annual_benefit > 0:
        payback_years = initial_cost / net_annual_benefit
    else:
        payback_years = lifespan * 2  # Use a large number instead of inf
    
    # Temperature impact
    temp_reduction = cost_data["temp_reduction_c"] * actual_quantity
    
    return {
        "intervention_type": intervention_type,
        "quantity": actual_quantity,
        "initial_cost_usd": round(initial_cost, 2),
        "annual_benefits": {
            "energy_savings_usd": round(annual_energy_savings_usd, 2),
            "carbon_credits_usd": round(annual_carbon_credits_usd, 2),
            "total_usd": round(annual_energy_savings_usd + annual_carbon_credits_usd, 2)
        },
        "annual_costs": {
            "maintenance_usd": round(annual_maintenance, 2)
        },
        "net_annual_benefit_usd": round(net_annual_benefit, 2),
        "npv_usd": round(npv, 2),
        "roi_percent": round(roi_percent, 2),
        "payback_years": round(payback_years, 1),
        "lifespan_years": lifespan,
        "co2_offset_kg_per_year": round(annual_co2_kg, 2),
        "energy_saved_kwh_per_year": round(annual_energy_kwh, 2),
        "temp_reduction_c": round(temp_reduction, 2),
        "timestamp": datetime.now().isoformat()
    }

def optimize_intervention_mix(budget_usd: float, priorities: List[str] = None) -> Dict:
    """
    AI-powered optimization: Suggest optimal intervention mix within budget
    
    Args:
        budget_usd: Total budget available
        priorities: List of priority areas ["temperature", "carbon", "energy", "flood"]
    
    Returns:
        Optimized intervention mix with CBA
    """
    if priorities is None:
        priorities = ["temperature", "carbon", "energy"]
    
    # Simple greedy algorithm (can be enhanced with ML optimization)
    recommendations = []
    remaining_budget = budget_usd
    total_benefits = 0
    
    # Calculate ROI for each intervention type
    intervention_rois = []
    
    # Sample quantities for ROI calculation
    sample_quantities = {
        "tree": 100,
        "reflective_paint": 1000,  # m²
        "green_roof": 500,  # m²
        "coastal_barrier": 1,
        "cooling_mist": 1
    }
    
    for int_type, quantity in sample_quantities.items():
        cba = calculate_intervention_cba(int_type, quantity, area=quantity if "paint" in int_type or "roof" in int_type else None)
        if "error" not in cba and cba["roi_percent"] > 0:
            intervention_rois.append({
                "type": int_type,
                "roi": cba["roi_percent"],
                "initial_cost": cba["initial_cost_usd"],
                "cba": cba
            })
    
    # Sort by ROI (descending)
    intervention_rois.sort(key=lambda x: x["roi"], reverse=True)
    
    # Allocate budget
    for item in intervention_rois:
        if remaining_budget <= 0:
            break
        
        int_type = item["type"]
        cost_data = INTERVENTION_COSTS[int_type]
        
        # Calculate how many units we can afford
        if int_type in ["reflective_paint", "green_roof"]:
            # Area-based
            affordable_area = min(remaining_budget / cost_data["installation"], sample_quantities[int_type] * 2)
            if affordable_area > 0:
                cba = calculate_intervention_cba(int_type, 0, area=affordable_area)
                recommendations.append(cba)
                remaining_budget -= cba["initial_cost_usd"]
                total_benefits += cba["net_annual_benefit_usd"]
        else:
            # Count-based
            affordable_count = min(int(remaining_budget / cost_data["installation"]), sample_quantities[int_type] * 2)
            if affordable_count > 0:
                cba = calculate_intervention_cba(int_type, affordable_count)
                recommendations.append(cba)
                remaining_budget -= cba["initial_cost_usd"]
                total_benefits += cba["net_annual_benefit_usd"]
    
    # Calculate aggregate metrics
    total_initial_cost = sum(r["initial_cost_usd"] for r in recommendations)
    total_npv = sum(r["npv_usd"] for r in recommendations)
    total_co2_per_year = sum(r["co2_offset_kg_per_year"] for r in recommendations)
    total_energy_per_year = sum(r["energy_saved_kwh_per_year"] for r in recommendations)
    
    return {
        "budget_allocated_usd": round(total_initial_cost, 2),
        "budget_remaining_usd": round(remaining_budget, 2),
        "recommendations": recommendations,
        "aggregate_metrics": {
            "total_npv_usd": round(total_npv, 2),
            "total_annual_benefit_usd": round(total_benefits, 2),
            "total_co2_offset_kg_per_year": round(total_co2_per_year, 2),
            "total_energy_saved_kwh_per_year": round(total_energy_per_year, 2),
            "overall_roi_percent": round(((total_npv - total_initial_cost) / total_initial_cost * 100) if total_initial_cost > 0 else 0, 2)
        },
        "timestamp": datetime.now().isoformat()
    }

