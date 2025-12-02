"""
Long-Term Climate Impact Projection Model
Projects climate metrics over 1 month, 1 year, and 10 years
"""
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List

class LongTermProjectionModel:
    """Model for long-term climate projections"""
    
    def __init__(self, region: str = "Anand Vihar"):
        self.region = region
    
    def generate_projections(self, current_state: Dict) -> Dict:
        """Generate long-term projections"""
        projections = {
            "1_month": self._project_1_month(current_state),
            "1_year": self._project_1_year(current_state),
            "10_years": self._project_10_years(current_state)
        }
        
        return {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "projections": projections,
            "intervention_impact": self._calculate_intervention_impact(current_state)
        }
    
    def _project_1_month(self, state: Dict) -> Dict:
        """Project 1 month ahead"""
        current_aqi = state.get("current_metrics", {}).get("aqi", {}).get("average_aqi", 80)
        current_temp = state.get("current_metrics", {}).get("heat_island", {}).get("average_temperature", 30.0)
        
        # Seasonal variation (assuming current is baseline)
        # Add some variation
        projected_aqi = current_aqi + np.random.normal(0, 10)
        projected_temp = current_temp + np.random.normal(0, 2)
        
        return {
            "timeframe": "1_month",
            "projected_aqi": round(max(0, min(500, projected_aqi)), 0),
            "projected_temperature": round(max(20, min(45, projected_temp)), 1),
            "pm25_reduction_potential": round(current_aqi * 0.05, 1),  # 5% reduction possible
            "heat_island_reduction_potential": round(1.0, 1)  # 1°C reduction possible
        }
    
    def _project_1_year(self, state: Dict) -> Dict:
        """Project 1 year ahead"""
        current_aqi = state.get("current_metrics", {}).get("aqi", {}).get("average_aqi", 80)
        current_temp = state.get("current_metrics", {}).get("heat_island", {}).get("average_temperature", 30.0)
        
        # With interventions, expect improvements
        projected_aqi = current_aqi * 0.85  # 15% reduction
        projected_temp = current_temp - 1.5  # 1.5°C reduction
        
        return {
            "timeframe": "1_year",
            "projected_aqi": round(max(0, min(500, projected_aqi)), 0),
            "projected_temperature": round(max(20, min(45, projected_temp)), 1),
            "pm25_reduction_potential": round(current_aqi * 0.20, 1),  # 20% reduction
            "heat_island_reduction_potential": round(2.0, 1),  # 2°C reduction
            "co2_reduction_tons": round(500.0, 1),
            "energy_savings_mwh": round(1000.0, 1)
        }
    
    def _project_10_years(self, state: Dict) -> Dict:
        """Project 10 years ahead"""
        current_aqi = state.get("current_metrics", {}).get("aqi", {}).get("average_aqi", 80)
        current_temp = state.get("current_metrics", {}).get("heat_island", {}).get("average_temperature", 30.0)
        
        # Long-term with sustained interventions
        projected_aqi = current_aqi * 0.60  # 40% reduction
        projected_temp = current_temp - 3.0  # 3°C reduction
        
        return {
            "timeframe": "10_years",
            "projected_aqi": round(max(0, min(500, projected_aqi)), 0),
            "projected_temperature": round(max(20, min(45, projected_temp)), 1),
            "pm25_reduction_potential": round(current_aqi * 0.50, 1),  # 50% reduction
            "heat_island_reduction_potential": round(4.0, 1),  # 4°C reduction
            "co2_reduction_tons": round(5000.0, 1),
            "energy_savings_mwh": round(10000.0, 1),
            "mortality_risk_reduction": round(15.0, 1),  # 15% reduction
            "aqi_category_transitions": {
                "unhealthy_to_moderate": True,
                "moderate_to_good": False  # May take longer
            }
        }
    
    def _calculate_intervention_impact(self, state: Dict) -> Dict:
        """Calculate impact of interventions"""
        interventions = state.get("interventions", [])
        
        if not interventions:
            return {
                "interventions_applied": 0,
                "estimated_impact": "No interventions applied"
            }
        
        total_impact = {
            "aqi_reduction": 0,
            "temperature_reduction": 0,
            "co2_reduction_tons": 0,
            "energy_savings_mwh": 0
        }
        
        for intervention in interventions:
            if intervention["type"] == "cooling_node":
                total_impact["temperature_reduction"] += 2.0
                total_impact["energy_savings_mwh"] += 50.0
            elif intervention["type"] == "tree_plantation":
                total_impact["aqi_reduction"] += 5.0
                total_impact["temperature_reduction"] += 1.0
                total_impact["co2_reduction_tons"] += 10.0
            elif intervention["type"] == "air_purifier":
                total_impact["aqi_reduction"] += 15.0
        
        return {
            "interventions_applied": len(interventions),
            "estimated_impact": total_impact
        }

