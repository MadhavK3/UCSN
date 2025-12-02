"""
Traffic Emission Model
Simulates CO₂ and pollutant emissions from traffic
"""
import numpy as np
from datetime import datetime
from typing import Dict, List

class TrafficEmissionModel:
    """Model for traffic emission calculations"""
    
    def __init__(self, region: str = "Anand Vihar"):
        self.region = region
        self.hour = datetime.now().hour
        self.base_vehicle_count = 1000  # Base vehicles per hour
    
    def calculate_emissions(self) -> Dict:
        """Calculate traffic emissions for all zones"""
        zones = self._get_zone_configs()
        zone_emissions = {}
        
        for zone in zones:
            zone_id = zone["id"]
            
            # Calculate vehicle count based on traffic intensity and time
            if 8 <= self.hour <= 10 or 17 <= self.hour <= 20:
                # Peak hours
                vehicle_count = self.base_vehicle_count * zone["traffic_intensity"] * 2.5
            else:
                vehicle_count = self.base_vehicle_count * zone["traffic_intensity"] * 0.8
            
            # Emission factors (grams per vehicle per km)
            co2_per_vehicle_km = 120.0  # grams
            nox_per_vehicle_km = 0.5
            pm25_per_vehicle_km = 0.02
            
            # Average trip length in zone (km)
            avg_trip_length = zone.get("area_km2", 0.5) ** 0.5 * 2.0
            
            # Calculate emissions
            co2_emissions = (vehicle_count * co2_per_vehicle_km * avg_trip_length) / 1000.0  # kg
            nox_emissions = vehicle_count * nox_per_vehicle_km * avg_trip_length  # grams
            pm25_emissions = vehicle_count * pm25_per_vehicle_km * avg_trip_length  # grams
            
            # CO₂ concentration (simplified model)
            co2_concentration = 400 + (co2_emissions / zone.get("area_km2", 0.5)) * 0.1  # ppm
            
            zone_emissions[zone_id] = {
                "vehicle_count_per_hour": round(vehicle_count, 0),
                "co2_emissions_kg_per_hour": round(co2_emissions, 2),
                "nox_emissions_g_per_hour": round(nox_emissions, 2),
                "pm25_emissions_g_per_hour": round(pm25_emissions, 2),
                "co2_concentration_ppm": round(co2_concentration, 1),
                "traffic_intensity": zone["traffic_intensity"],
                "peak_hour": 8 <= self.hour <= 10 or 17 <= self.hour <= 20
            }
        
        # Calculate total emissions
        total_co2 = sum([z["co2_emissions_kg_per_hour"] for z in zone_emissions.values()])
        total_pm25 = sum([z["pm25_emissions_g_per_hour"] for z in zone_emissions.values()])
        
        return {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "zones": zone_emissions,
            "total_emissions": {
                "co2_kg_per_hour": round(total_co2, 2),
                "pm25_g_per_hour": round(total_pm25, 2)
            },
            "peak_hour": 8 <= self.hour <= 10 or 17 <= self.hour <= 20,
            "worst_zone": max(zone_emissions.items(), key=lambda x: x[1]["co2_emissions_kg_per_hour"])[0]
        }
    
    def _get_zone_configs(self) -> List[Dict]:
        """Get zone configurations"""
        return [
            {"id": "zone_isbt", "traffic_intensity": 0.95, "area_km2": 0.5},
            {"id": "zone_railway", "traffic_intensity": 0.9, "area_km2": 0.3},
            {"id": "zone_metro", "traffic_intensity": 0.85, "area_km2": 0.2},
            {"id": "zone_industrial", "traffic_intensity": 0.6, "area_km2": 1.2},
            {"id": "zone_residential", "traffic_intensity": 0.5, "area_km2": 2.0},
            {"id": "zone_commercial", "traffic_intensity": 0.9, "area_km2": 0.8}
        ]

