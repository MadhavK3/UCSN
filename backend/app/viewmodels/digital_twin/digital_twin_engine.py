"""
Digital Twin Engine for Anand Vihar
Simulates AQI, PM2.5, CO₂, heat islands, traffic emissions, and long-term projections
"""
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import math

class DigitalTwinEngine:
    """
    Main digital twin engine that coordinates all simulation models
    """
    
    def __init__(self, region="Anand Vihar"):
        self.region = region
        self.models = {
            "aqi": None,
            "heat": None,
            "dispersion": None,
            "traffic": None,
            "long_term": None
        }
        self.state = self._initialize_state()
    
    def _initialize_state(self) -> Dict:
        """Initialize digital twin state"""
        return {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "zones": [],
            "sensors": [],
            "interventions": [],
            "metrics": {
                "aqi": {},
                "temperature": {},
                "co2": {},
                "pm25": {},
                "heat_island_intensity": {}
            }
        }
    
    def generate_state(self, include_projections: bool = True) -> Dict:
        """
        Generate complete digital twin state
        """
        from app.viewmodels.digital_twin.simulation_models.aqi_model import AQIModel
        from app.viewmodels.digital_twin.simulation_models.heat_model import HeatModel
        from app.viewmodels.digital_twin.simulation_models.dispersion import DispersionModel
        from app.viewmodels.digital_twin.simulation_models.traffic_emissions import TrafficEmissionModel
        from app.viewmodels.digital_twin.simulation_models.long_term_projection import LongTermProjectionModel
        from app.viewmodels.ingestion.openweather import fetch_weather_by_coords
        import os
        
        # Fetch real-time weather data
        # Center of Anand Vihar: 28.6506, 77.3153
        api_key = os.getenv("OPENWEATHER_API_KEY")
        real_weather = fetch_weather_by_coords(28.6506, 77.3153, api_key)
        
        # Extract real values or use defaults if fetch failed
        current_temp = 28.0
        current_wind_speed = 5.0
        current_wind_deg = 270
        
        if real_weather and "main" in real_weather:
            current_temp = real_weather["main"]["temp"] - 273.15 # Kelvin to Celsius
        if real_weather and "wind" in real_weather:
            current_wind_speed = real_weather["wind"].get("speed", 5.0)
            current_wind_deg = real_weather["wind"].get("deg", 270)
            
        # Initialize models with real data
        aqi_model = AQIModel(self.region, base_temp=current_temp, wind_speed=current_wind_speed)
        heat_model = HeatModel(self.region, base_temp=current_temp)
        dispersion_model = DispersionModel(self.region, wind_speed=current_wind_speed, wind_direction=current_wind_deg)
        traffic_model = TrafficEmissionModel(self.region)
        
        # Get current conditions
        aqi_data = aqi_model.calculate_aqi()
        heat_data = heat_model.calculate_heat_island()
        dispersion_data = dispersion_model.calculate_dispersion()
        traffic_data = traffic_model.calculate_emissions()
        
        # Get zones
        zones = self._generate_zones()
        
        # Get sensors
        sensors = self._generate_sensors(aqi_data, heat_data)
        
        # Get hotspots
        hotspots = self._calculate_hotspots(zones, aqi_data, heat_data, traffic_data)
        
        state = {
            "region": self.region,
            "timestamp": datetime.now().isoformat(),
            "zones": zones,
            "sensors": sensors,
            "hotspots": hotspots,
            "current_metrics": {
                "aqi": aqi_data,
                "heat_island": heat_data,
                "pm25_dispersion": dispersion_data,
                "traffic_emissions": traffic_data
            },
            "interventions": []
        }
        
        # Add long-term projections if requested
        if include_projections:
            long_term_model = LongTermProjectionModel(self.region)
            projections = long_term_model.generate_projections(state)
            state["projections"] = projections
        
        return state
    
    def _generate_zones(self) -> List[Dict]:
        """Generate zones for Anand Vihar"""
        return [
            {
                "id": "zone_isbt",
                "name": "Anand Vihar ISBT",
                "type": "transport_hub",
                "coordinates": {"lat": 28.6506, "lon": 77.3153},
                "area_km2": 0.5,
                "building_density": 0.9,
                "traffic_intensity": 0.95,
                "green_coverage": 0.1
            },
            {
                "id": "zone_railway",
                "name": "Anand Vihar Railway Station",
                "type": "transport_hub",
                "coordinates": {"lat": 28.6512, "lon": 77.3145},
                "area_km2": 0.3,
                "building_density": 0.85,
                "traffic_intensity": 0.9,
                "green_coverage": 0.15
            },
            {
                "id": "zone_metro",
                "name": "Anand Vihar Metro Station",
                "type": "transport_hub",
                "coordinates": {"lat": 28.6500, "lon": 77.3160},
                "area_km2": 0.2,
                "building_density": 0.8,
                "traffic_intensity": 0.85,
                "green_coverage": 0.2
            },
            {
                "id": "zone_industrial",
                "name": "Industrial Pockets",
                "type": "industrial",
                "coordinates": {"lat": 28.6520, "lon": 77.3170},
                "area_km2": 1.2,
                "building_density": 0.7,
                "traffic_intensity": 0.6,
                "green_coverage": 0.05,
                "emission_factor": 1.5
            },
            {
                "id": "zone_residential",
                "name": "Residential Areas",
                "type": "residential",
                "coordinates": {"lat": 28.6480, "lon": 77.3130},
                "area_km2": 2.0,
                "building_density": 0.6,
                "traffic_intensity": 0.5,
                "green_coverage": 0.25
            },
            {
                "id": "zone_commercial",
                "name": "Commercial Corridor",
                "type": "commercial",
                "coordinates": {"lat": 28.6490, "lon": 77.3150},
                "area_km2": 0.8,
                "building_density": 0.95,
                "traffic_intensity": 0.9,
                "green_coverage": 0.1
            }
        ]
    
    def _generate_sensors(self, aqi_data: Dict, heat_data: Dict) -> List[Dict]:
        """Generate virtual sensor readings"""
        from app.viewmodels.digital_twin.sensor_simulation import generate_sensor_readings
        
        zones = self._generate_zones()
        sensors = []
        
        for zone in zones:
            zone_aqi = aqi_data.get("zones", {}).get(zone["id"], {}).get("aqi", 80)
            zone_temp = heat_data.get("zones", {}).get(zone["id"], {}).get("temperature", 30.0)
            
            sensor_readings = generate_sensor_readings(
                zone["id"],
                zone["coordinates"],
                base_aqi=zone_aqi,
                base_temp=zone_temp
            )
            sensors.append(sensor_readings)
        
        return sensors
    
    def _calculate_hotspots(self, zones: List[Dict], aqi_data: Dict, heat_data: Dict, traffic_data: Dict) -> List[Dict]:
        """Calculate pollution and heat hotspots"""
        hotspots = []
        
        for zone in zones:
            zone_id = zone["id"]
            aqi = aqi_data.get("zones", {}).get(zone_id, {}).get("aqi", 80)
            temp = heat_data.get("zones", {}).get(zone_id, {}).get("temperature", 30.0)
            pm25 = aqi_data.get("zones", {}).get(zone_id, {}).get("pm25", 50.0)
            
            # Calculate hotspot severity
            severity = "Low"
            if aqi > 200 or temp > 38:
                severity = "Critical"
            elif aqi > 150 or temp > 35:
                severity = "High"
            elif aqi > 100 or temp > 32:
                severity = "Medium"
            
            if severity != "Low":
                hotspots.append({
                    "zone_id": zone_id,
                    "zone_name": zone["name"],
                    "type": "pollution" if aqi > 100 else "heat",
                    "severity": severity,
                    "coordinates": zone["coordinates"],
                    "metrics": {
                        "aqi": round(aqi, 0),
                        "temperature": round(temp, 1),
                        "pm25": round(pm25, 1)
                    },
                    "radius_km": 0.5
                })
        
        return hotspots
    
    def update_state(self, interventions: List[Dict]) -> Dict:
        """Update state based on interventions"""
        state = self.generate_state()
        state["interventions"] = interventions
        
        # Apply intervention effects
        for intervention in interventions:
            if intervention["type"] == "cooling_node":
                # Reduce temperature in affected zones
                for zone in state["zones"]:
                    if zone["id"] in intervention.get("affected_zones", []):
                        if "temperature" in zone:
                            zone["temperature"] -= 2.0
        
        return state

def get_digital_twin_state(region: str = "Anand Vihar", include_projections: bool = True) -> Dict:
    """Get digital twin state for a region"""
    engine = DigitalTwinEngine(region)
    return engine.generate_state(include_projections)

