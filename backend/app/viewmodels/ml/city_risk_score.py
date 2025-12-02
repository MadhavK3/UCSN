"""
Sector-Wise Criticality Ranking (City Risk Score)
AI ranks each region as Low, Medium, High, Critical based on multiple factors
"""
import numpy as np
from datetime import datetime
from typing import Dict, List
from app.viewmodels.ml.command_hub import get_command_hub_status

class CityRiskScorer:
    """
    AI-based risk scoring system for city sectors
    """
    
    def __init__(self):
        # Risk thresholds
        self.thresholds = {
            "temperature": {"low": 30, "medium": 33, "high": 36, "critical": 39},
            "aqi": {"low": 50, "medium": 100, "high": 150, "critical": 200},
            "flood_risk": {"low": "Low", "medium": "Medium", "high": "High", "critical": "High"},
            "energy_load": {"low": 0.8, "medium": 0.9, "high": 1.0, "critical": 1.1}  # Multiplier
        }
        
        # Sector definitions (Mumbai zones)
        self.sectors = [
            {"id": "sector_1", "name": "South Mumbai", "lat": 18.9388, "lon": 72.8353, "population_density": 0.9},
            {"id": "sector_2", "name": "Central Mumbai", "lat": 19.0760, "lon": 72.8777, "population_density": 1.0},
            {"id": "sector_3", "name": "North Mumbai", "lat": 19.2183, "lon": 72.9781, "population_density": 0.8},
            {"id": "sector_4", "name": "Eastern Suburbs", "lat": 19.1136, "lon": 72.8697, "population_density": 0.95},
            {"id": "sector_5", "name": "Western Suburbs", "lat": 19.1418, "lon": 72.8269, "population_density": 0.85},
            {"id": "sector_6", "name": "Coastal Zone", "lat": 19.0169, "lon": 72.8280, "population_density": 0.7}
        ]
    
    def calculate_sector_risk(self, sector: Dict, hub_status: Dict) -> Dict:
        """
        Calculate risk score for a single sector
        """
        # Get base metrics (using city-wide data as proxy, in real app would be sector-specific)
        temp = hub_status["subsystems"]["uhi"]["average_temp"]
        aqi = hub_status["subsystems"]["air_quality"]["aqi"]
        flood_risk = hub_status["subsystems"]["flood"]["risk"]
        energy_load = hub_status["subsystems"]["energy"]["forecast"]["peak_demand"] / 4500.0  # Normalized
        
        # Add sector-specific variations
        sector_temp = temp + np.random.normal(0, 1.5)  # Sector variation
        sector_aqi = aqi + np.random.normal(0, 15)
        
        # Calculate individual risk scores (0-100)
        temp_score = self._score_metric(sector_temp, self.thresholds["temperature"])
        aqi_score = self._score_metric(sector_aqi, self.thresholds["aqi"])
        flood_score = self._score_categorical(flood_risk, self.thresholds["flood_risk"])
        energy_score = self._score_metric(energy_load, self.thresholds["energy_load"], is_multiplier=True)
        
        # Population density multiplier (higher density = higher risk)
        pop_multiplier = 1.0 + (sector["population_density"] - 0.7) * 0.3
        
        # Weighted risk score
        weights = {
            "temperature": 0.3,
            "aqi": 0.2,
            "flood": 0.25,
            "energy": 0.15,
            "population": 0.1
        }
        
        composite_score = (
            temp_score * weights["temperature"] +
            aqi_score * weights["aqi"] +
            flood_score * weights["flood"] +
            energy_score * weights["energy"] +
            (sector["population_density"] * 100) * weights["population"]
        ) * pop_multiplier
        
        # Determine risk level
        if composite_score >= 75:
            risk_level = "Critical"
        elif composite_score >= 60:
            risk_level = "High"
        elif composite_score >= 40:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        return {
            "sector_id": sector["id"],
            "sector_name": sector["name"],
            "coordinates": {"lat": sector["lat"], "lon": sector["lon"]},
            "risk_score": round(composite_score, 1),
            "risk_level": risk_level,
            "factors": {
                "temperature": {
                    "value": round(sector_temp, 1),
                    "score": round(temp_score, 1),
                    "contribution": f"{temp_score * weights['temperature']:.1f}%"
                },
                "aqi": {
                    "value": round(sector_aqi, 0),
                    "score": round(aqi_score, 1),
                    "contribution": f"{aqi_score * weights['aqi']:.1f}%"
                },
                "flood_risk": {
                    "value": flood_risk,
                    "score": round(flood_score, 1),
                    "contribution": f"{flood_score * weights['flood']:.1f}%"
                },
                "energy_load": {
                    "value": round(energy_load, 2),
                    "score": round(energy_score, 1),
                    "contribution": f"{energy_score * weights['energy']:.1f}%"
                },
                "population_density": {
                    "value": sector["population_density"],
                    "contribution": f"{(sector['population_density'] * 100) * weights['population']:.1f}%"
                }
            },
            "recommendations": self._get_recommendations(risk_level, sector_temp, sector_aqi, flood_risk)
        }
    
    def _score_metric(self, value: float, thresholds: Dict, is_multiplier: bool = False) -> float:
        """Convert metric value to risk score (0-100)"""
        if is_multiplier:
            # For multipliers, higher is worse
            if value >= thresholds["critical"]:
                return 100
            elif value >= thresholds["high"]:
                return 75 + (value - thresholds["high"]) / (thresholds["critical"] - thresholds["high"]) * 25
            elif value >= thresholds["medium"]:
                return 50 + (value - thresholds["medium"]) / (thresholds["high"] - thresholds["medium"]) * 25
            elif value >= thresholds["low"]:
                return 25 + (value - thresholds["low"]) / (thresholds["medium"] - thresholds["low"]) * 25
            else:
                return value / thresholds["low"] * 25
        else:
            # For absolute values
            if value >= thresholds["critical"]:
                return 100
            elif value >= thresholds["high"]:
                return 75 + (value - thresholds["high"]) / (thresholds["critical"] - thresholds["high"]) * 25
            elif value >= thresholds["medium"]:
                return 50 + (value - thresholds["medium"]) / (thresholds["high"] - thresholds["medium"]) * 25
            elif value >= thresholds["low"]:
                return 25 + (value - thresholds["low"]) / (thresholds["medium"] - thresholds["low"]) * 25
            else:
                return value / thresholds["low"] * 25
    
    def _score_categorical(self, value: str, thresholds: Dict) -> float:
        """Convert categorical value to risk score"""
        if value == thresholds["critical"] or value == "High":
            return 100
        elif value == thresholds["high"] or value == "Medium":
            return 60
        elif value == thresholds["medium"] or value == "Low":
            return 30
        else:
            return 10
    
    def _get_recommendations(self, risk_level: str, temp: float, aqi: float, flood: str) -> List[str]:
        """Generate AI recommendations based on risk factors"""
        recommendations = []
        
        if risk_level == "Critical":
            recommendations.append("IMMEDIATE INTERVENTION REQUIRED")
            if temp > 38:
                recommendations.append("Deploy emergency cooling systems")
            if aqi > 200:
                recommendations.append("Activate all air purification units")
            if flood == "High":
                recommendations.append("Raise all coastal barriers immediately")
        elif risk_level == "High":
            recommendations.append("High-priority monitoring and preparation")
            if temp > 35:
                recommendations.append("Prepare cooling systems for activation")
            if aqi > 150:
                recommendations.append("Monitor air quality closely")
        elif risk_level == "Medium":
            recommendations.append("Standard monitoring protocols")
        else:
            recommendations.append("All systems normal")
        
        return recommendations

def get_city_risk_scores(city: str = "Mumbai") -> Dict:
    """
    Get risk scores for all city sectors
    """
    scorer = CityRiskScorer()
    hub_status = get_command_hub_status(city)
    
    sector_risks = []
    for sector in scorer.sectors:
        risk_data = scorer.calculate_sector_risk(sector, hub_status)
        sector_risks.append(risk_data)
    
    # Sort by risk score (highest first)
    sector_risks.sort(key=lambda x: x["risk_score"], reverse=True)
    
    # Calculate city-wide metrics
    avg_risk = np.mean([s["risk_score"] for s in sector_risks])
    critical_count = sum(1 for s in sector_risks if s["risk_level"] == "Critical")
    high_count = sum(1 for s in sector_risks if s["risk_level"] == "High")
    
    # Overall city risk level
    if avg_risk >= 70 or critical_count >= 2:
        city_risk_level = "Critical"
    elif avg_risk >= 55 or high_count >= 3:
        city_risk_level = "High"
    elif avg_risk >= 40:
        city_risk_level = "Medium"
    else:
        city_risk_level = "Low"
    
    return {
        "city": city,
        "timestamp": datetime.now().isoformat(),
        "city_risk_level": city_risk_level,
        "city_risk_score": round(avg_risk, 1),
        "sector_count": len(sector_risks),
        "risk_distribution": {
            "critical": critical_count,
            "high": high_count,
            "medium": sum(1 for s in sector_risks if s["risk_level"] == "Medium"),
            "low": sum(1 for s in sector_risks if s["risk_level"] == "Low")
        },
        "sectors": sector_risks,
        "top_risks": sector_risks[:3],  # Top 3 highest risk sectors
        "recommendations": {
            "priority_actions": [
                f"Focus on {sector_risks[0]['sector_name']} (highest risk: {sector_risks[0]['risk_level']})",
                f"Monitor {sector_risks[1]['sector_name']} and {sector_risks[2]['sector_name']} closely"
            ] if len(sector_risks) >= 3 else [],
            "city_wide": f"City-wide risk level: {city_risk_level}. {critical_count} critical sector(s), {high_count} high-risk sector(s)."
        }
    }

