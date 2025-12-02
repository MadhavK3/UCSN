"""
Heat Island Model for Digital Twin
Simulates urban heat island intensity based on building density, green coverage, and traffic
"""
import numpy as np
from datetime import datetime
from typing import Dict, List
import math

class HeatModel:
    """Model for calculating urban heat island intensity"""
    
    def __init__(self, region: str = "Anand Vihar", base_temp: float = 28.0):
        self.region = region
        self.base_temp = base_temp  # Base temperature from live weather
        self.hour = datetime.now().hour
    
    def calculate_heat_island(self) -> Dict:
        """Calculate heat island intensity for all zones"""
        zones = self._get_zone_configs()
        zone_heat = {}
        
        # Diurnal variation
        diurnal_factor = 6.0 * math.sin((self.hour - 8) * math.pi / 12)
        current_base = self.base_temp + diurnal_factor
        
        for zone in zones:
            zone_id = zone["id"]
            
            # Base temperature
            temp = current_base
            
            # Building density increases temperature (concrete absorbs heat)
            density_heat = zone["building_density"] * 4.0
            
            # Traffic contributes to heat
            if 8 <= self.hour <= 10 or 17 <= self.hour <= 20:
                traffic_heat = zone["traffic_intensity"] * 2.5
            else:
                traffic_heat = zone["traffic_intensity"] * 1.0
            
            # Green coverage reduces temperature
            green_cooling = zone["green_coverage"] * 3.0
            
            # Industrial heat
            industrial_heat = 0
            if zone.get("emission_factor"):
                industrial_heat = (zone["emission_factor"] - 1.0) * 1.5
            
            # Calculate final temperature
            temp = temp + density_heat + traffic_heat - green_cooling + industrial_heat
            temp = max(20, min(45, temp))  # Clamp to reasonable range
            
            # Heat island intensity (difference from base)
            heat_island_intensity = temp - current_base
            
            # Calculate heat index (feels like temperature)
            humidity = 60.0  # Assume 60% humidity
            heat_index = self._calculate_heat_index(temp, humidity)
            
            zone_heat[zone_id] = {
                "temperature": round(temp, 1),
                "heat_island_intensity": round(heat_island_intensity, 1),
                "heat_index": round(heat_index, 1),
                "humidity": round(humidity, 1),
                "risk_level": self._get_risk_level(temp),
                "factors": {
                    "density_contribution": round(density_heat, 1),
                    "traffic_contribution": round(traffic_heat, 1),
                    "green_cooling": round(green_cooling, 1),
                    "industrial_heat": round(industrial_heat, 1)
                }
            }
        
        # Calculate region-wide average
        avg_temp = np.mean([z["temperature"] for z in zone_heat.values()])
        max_temp = max([z["temperature"] for z in zone_heat.values()])
        
        return {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "average_temperature": round(avg_temp, 1),
            "maximum_temperature": round(max_temp, 1),
            "heat_island_intensity_avg": round(avg_temp - current_base, 1),
            "zones": zone_heat,
            "hottest_zone": max(zone_heat.items(), key=lambda x: x[1]["temperature"])[0]
        }
    
    def _calculate_heat_index(self, temp: float, humidity: float) -> float:
        """Calculate heat index (feels like temperature)"""
        # Simplified heat index formula
        hi = 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (humidity * 0.094))
        if temp >= 80 and humidity >= 40:
            hi = -42.379 + 2.04901523 * temp + 10.14333127 * humidity - 0.22475541 * temp * humidity
        return hi
    
    def _get_risk_level(self, temp: float) -> str:
        """Get heat risk level"""
        if temp > 40:
            return "Critical"
        elif temp > 35:
            return "High"
        elif temp > 32:
            return "Medium"
        else:
            return "Low"
    
    def _get_zone_configs(self) -> List[Dict]:
        """Get zone configurations"""
        return [
            {"id": "zone_isbt", "traffic_intensity": 0.95, "green_coverage": 0.1, "building_density": 0.9},
            {"id": "zone_railway", "traffic_intensity": 0.9, "green_coverage": 0.15, "building_density": 0.85},
            {"id": "zone_metro", "traffic_intensity": 0.85, "green_coverage": 0.2, "building_density": 0.8},
            {"id": "zone_industrial", "traffic_intensity": 0.6, "green_coverage": 0.05, "building_density": 0.7, "emission_factor": 1.5},
            {"id": "zone_residential", "traffic_intensity": 0.5, "green_coverage": 0.25, "building_density": 0.6},
            {"id": "zone_commercial", "traffic_intensity": 0.9, "green_coverage": 0.1, "building_density": 0.95}
        ]

