"""
PM2.5 Dispersion Model
Simulates PM2.5 dispersion based on wind direction, traffic load, and building layout
"""
import numpy as np
from datetime import datetime
from typing import Dict, List
import math

class DispersionModel:
    """Model for PM2.5 dispersion simulation"""
    
    def __init__(self, region: str = "Anand Vihar", wind_speed: float = 5.0, wind_direction: float = 270.0):
        self.region = region
        self.wind_speed = wind_speed
        self.wind_direction = wind_direction
        self.hour = datetime.now().hour
    
    def calculate_dispersion(self) -> Dict:
        """Calculate PM2.5 dispersion across zones"""
        zones = self._get_zone_positions()
        dispersion_map = {}
        
        # Wind factors
        wind_factor = self.wind_speed / 10.0  # Normalize wind speed
        
        # Calculate base PM2.5 for each zone
        for zone in zones:
            zone_id = zone["id"]
            base_pm25 = zone.get("base_pm25", 50.0)
            
            # Calculate upwind/downwind effects
            upwind_zones = self._get_upwind_zones(zone, zones)
            downwind_zones = self._get_downwind_zones(zone, zones)
            
            # Upwind contribution (pollution from upwind zones)
            upwind_pm25 = 0
            for upwind in upwind_zones:
                distance = self._calculate_distance(zone, upwind)
                if distance > 0:
                    contribution = upwind.get("base_pm25", 50.0) * math.exp(-distance / 2.0) * wind_factor
                    upwind_pm25 += contribution
            
            # Downwind dilution (wind carries pollution away)
            downwind_dilution = wind_factor * 0.3
            
            # Building density affects dispersion (less dispersion in dense areas)
            density_factor = 1.0 - (zone.get("building_density", 0.5) * 0.4)
            
            # Final PM2.5 concentration
            pm25 = base_pm25 + upwind_pm25 - downwind_dilution
            pm25 = pm25 * density_factor
            pm25 = max(0, min(500, pm25))  # Clamp to valid range
            
            dispersion_map[zone_id] = {
                "pm25": round(pm25, 1),
                "base_pm25": round(base_pm25, 1),
                "upwind_contribution": round(upwind_pm25, 1),
                "downwind_dilution": round(downwind_dilution, 1),
                "density_factor": round(density_factor, 2),
                "wind_effect": round(wind_factor, 2)
            }
        
        return {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "wind_speed_ms": self.wind_speed,
            "wind_direction_deg": self.wind_direction,
            "zones": dispersion_map,
            "average_pm25": round(np.mean([z["pm25"] for z in dispersion_map.values()]), 1)
        }
    
    def _get_zone_positions(self) -> List[Dict]:
        """Get zone positions and base PM2.5"""
        return [
            {"id": "zone_isbt", "lat": 28.6506, "lon": 77.3153, "base_pm25": 120.0, "building_density": 0.9},
            {"id": "zone_railway", "lat": 28.6512, "lon": 77.3145, "base_pm25": 110.0, "building_density": 0.85},
            {"id": "zone_metro", "lat": 28.6500, "lon": 77.3160, "base_pm25": 100.0, "building_density": 0.8},
            {"id": "zone_industrial", "lat": 28.6520, "lon": 77.3170, "base_pm25": 150.0, "building_density": 0.7},
            {"id": "zone_residential", "lat": 28.6480, "lon": 77.3130, "base_pm25": 60.0, "building_density": 0.6},
            {"id": "zone_commercial", "lat": 28.6490, "lon": 77.3150, "base_pm25": 130.0, "building_density": 0.95}
        ]
    
    def _get_upwind_zones(self, zone: Dict, all_zones: List[Dict]) -> List[Dict]:
        """Get zones upwind from current zone"""
        # Simplified: zones to the west (assuming wind from west)
        upwind = []
        for z in all_zones:
            if z["id"] != zone["id"]:
                # Check if zone is upwind (west of current zone)
                if z["lon"] < zone["lon"]:
                    upwind.append(z)
        return upwind
    
    def _get_downwind_zones(self, zone: Dict, all_zones: List[Dict]) -> List[Dict]:
        """Get zones downwind from current zone"""
        downwind = []
        for z in all_zones:
            if z["id"] != zone["id"]:
                if z["lon"] > zone["lon"]:
                    downwind.append(z)
        return downwind
    
    def _calculate_distance(self, zone1: Dict, zone2: Dict) -> float:
        """Calculate distance between two zones (km)"""
        # Haversine formula (simplified)
        lat1, lon1 = zone1["lat"], zone1["lon"]
        lat2, lon2 = zone2["lat"], zone2["lon"]
        
        dlat = (lat2 - lat1) * 111.0  # Approximate km per degree
        dlon = (lon2 - lon1) * 111.0 * math.cos(math.radians(lat1))
        
        return math.sqrt(dlat**2 + dlon**2)

