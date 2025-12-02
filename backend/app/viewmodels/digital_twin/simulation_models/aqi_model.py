"""
AQI Model for Digital Twin
Simulates AQI levels across regions based on traffic, industry, and weather
"""
import numpy as np
from datetime import datetime
from typing import Dict, List

class AQIModel:
    """Model for calculating AQI based on multiple factors"""
    
    def __init__(self, region: str = "Anand Vihar", base_temp: float = 28.0, wind_speed: float = 5.0):
        self.region = region
        self.base_temp = base_temp
        self.wind_speed = wind_speed
        
        # Adjust base AQI based on wind speed (higher wind = lower AQI)
        # Base AQI for Anand Vihar is typically high (around 200-300)
        self.base_aqi = max(50, 300 - (self.wind_speed * 15))
        self.hour = datetime.now().hour
    
    def calculate_aqi(self) -> Dict:
        """Calculate AQI for all zones"""
        zones = self._get_zone_configs()
        zone_aqi = {}
        
        for zone in zones:
            zone_id = zone["id"]
            
            # Base AQI
            aqi = self.base_aqi
            
            # Traffic contribution (peak hours)
            if 8 <= self.hour <= 10 or 17 <= self.hour <= 20:
                traffic_factor = zone["traffic_intensity"] * 40
            else:
                traffic_factor = zone["traffic_intensity"] * 20
            
            # Industrial contribution
            industrial_factor = 0
            if zone.get("emission_factor"):
                industrial_factor = (zone["emission_factor"] - 1.0) * 30
            
            # Green coverage reduces AQI
            green_reduction = zone["green_coverage"] * 20
            
            # Building density increases AQI (less dispersion)
            density_factor = zone["building_density"] * 15
            
            # Calculate final AQI
            aqi = aqi + traffic_factor + industrial_factor - green_reduction + density_factor
            aqi = max(0, min(500, aqi))  # Clamp to valid range
            
            # Calculate PM2.5 (correlated with AQI)
            pm25 = self._aqi_to_pm25(aqi)
            
            # Calculate PM10
            pm10 = pm25 * 1.5
            
            zone_aqi[zone_id] = {
                "aqi": round(aqi, 0),
                "pm25": round(pm25, 1),
                "pm10": round(pm10, 1),
                "no2": round(50 + (aqi - 80) * 0.5, 1),
                "co": round(1.0 + (aqi - 80) * 0.02, 2),
                "category": self._aqi_category(aqi),
                "factors": {
                    "traffic_contribution": round(traffic_factor, 1),
                    "industrial_contribution": round(industrial_factor, 1),
                    "green_reduction": round(green_reduction, 1),
                    "density_factor": round(density_factor, 1)
                }
            }
        
        # Calculate region-wide average
        avg_aqi = np.mean([z["aqi"] for z in zone_aqi.values()])
        
        return {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "average_aqi": round(avg_aqi, 0),
            "category": self._aqi_category(avg_aqi),
            "zones": zone_aqi,
            "worst_zone": max(zone_aqi.items(), key=lambda x: x[1]["aqi"])[0]
        }
    
    def _aqi_to_pm25(self, aqi: float) -> float:
        """Convert AQI to PM2.5 concentration (μg/m³)"""
        if aqi <= 50:
            return aqi * 0.5
        elif aqi <= 100:
            return 25 + (aqi - 50) * 0.5
        elif aqi <= 150:
            return 50 + (aqi - 100) * 0.5
        elif aqi <= 200:
            return 75 + (aqi - 150) * 0.5
        elif aqi <= 300:
            return 100 + (aqi - 200) * 0.5
        else:
            return 150 + (aqi - 300) * 0.5
    
    def _aqi_category(self, aqi: float) -> str:
        """Get AQI category"""
        if aqi <= 50:
            return "Good"
        elif aqi <= 100:
            return "Moderate"
        elif aqi <= 150:
            return "Unhealthy for Sensitive Groups"
        elif aqi <= 200:
            return "Unhealthy"
        elif aqi <= 300:
            return "Very Unhealthy"
        else:
            return "Hazardous"
    
    def _get_zone_configs(self) -> List[Dict]:
        """Get zone configurations for Anand Vihar"""
        return [
            {"id": "zone_isbt", "traffic_intensity": 0.95, "green_coverage": 0.1, "building_density": 0.9},
            {"id": "zone_railway", "traffic_intensity": 0.9, "green_coverage": 0.15, "building_density": 0.85},
            {"id": "zone_metro", "traffic_intensity": 0.85, "green_coverage": 0.2, "building_density": 0.8},
            {"id": "zone_industrial", "traffic_intensity": 0.6, "green_coverage": 0.05, "building_density": 0.7, "emission_factor": 1.5},
            {"id": "zone_residential", "traffic_intensity": 0.5, "green_coverage": 0.25, "building_density": 0.6},
            {"id": "zone_commercial", "traffic_intensity": 0.9, "green_coverage": 0.1, "building_density": 0.95}
        ]

