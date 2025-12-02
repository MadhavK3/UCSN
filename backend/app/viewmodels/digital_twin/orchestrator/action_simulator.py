"""
Action Simulator for Virtual Interventions
Simulates the effects of virtual actions
"""
from datetime import datetime
from typing import Dict, List

class ActionSimulator:
    """Simulates virtual actions and their effects"""
    
    def simulate_action(self, action: Dict, current_state: Dict) -> Dict:
        """Simulate a single virtual action"""
        action_type = action.get("type", "")
        
        if action_type == "virtual_cooling_node":
            return self._simulate_cooling_node(action, current_state)
        elif action_type == "virtual_air_purifier":
            return self._simulate_air_purifier(action, current_state)
        elif action_type == "virtual_coastal_shield":
            return self._simulate_coastal_shield(action, current_state)
        elif action_type == "virtual_green_corridor":
            return self._simulate_green_corridor(action, current_state)
        elif action_type == "virtual_traffic_rerouting":
            return self._simulate_traffic_rerouting(action, current_state)
        else:
            return self._simulate_generic(action, current_state)
    
    def _simulate_cooling_node(self, action: Dict, state: Dict) -> Dict:
        """Simulate cooling node activation"""
        zones = action.get("zones", [])
        intensity = action.get("intensity", 0.8)
        
        effects = []
        for zone_id in zones if isinstance(zones, list) else [zones]:
            # Reduce temperature in zone
            temp_reduction = 2.0 * intensity
            aqi_reduction = 5.0 * intensity  # Cooling also reduces AQI slightly
            
            effects.append({
                "zone_id": zone_id,
                "temperature_reduction_c": round(temp_reduction, 1),
                "aqi_reduction": round(aqi_reduction, 0),
                "energy_consumption_mw": action.get("energy_consumption_mw", 150)
            })
        
        return {
            "action_id": action.get("action", "COOLING_NODE"),
            "type": "cooling_node",
            "status": "simulated",
            "effects": effects,
            "timestamp": datetime.now().isoformat()
        }
    
    def _simulate_air_purifier(self, action: Dict, state: Dict) -> Dict:
        """Simulate air purifier activation"""
        zones = action.get("zones", [])
        aqi_reduction = action.get("aqi_reduction", 20)
        
        effects = []
        for zone_id in zones if isinstance(zones, list) else [zones]:
            effects.append({
                "zone_id": zone_id,
                "aqi_reduction": round(aqi_reduction, 0),
                "pm25_reduction": round(aqi_reduction * 0.5, 1),
                "energy_consumption_mw": action.get("energy_consumption_mw", 100)
            })
        
        return {
            "action_id": action.get("action", "AIR_PURIFIER"),
            "type": "air_purifier",
            "status": "simulated",
            "effects": effects,
            "timestamp": datetime.now().isoformat()
        }
    
    def _simulate_coastal_shield(self, action: Dict, state: Dict) -> Dict:
        """Simulate coastal shield deployment"""
        return {
            "action_id": action.get("action", "COASTAL_SHIELD"),
            "type": "coastal_shield",
            "status": "simulated",
            "effects": [{
                "flood_protection": "active",
                "wave_energy_generation_mw": 50.0
            }],
            "timestamp": datetime.now().isoformat()
        }
    
    def _simulate_green_corridor(self, action: Dict, state: Dict) -> Dict:
        """Simulate green corridor creation"""
        trees = action.get("trees", 100)
        
        return {
            "action_id": action.get("action", "GREEN_CORRIDOR"),
            "type": "green_corridor",
            "status": "simulated",
            "effects": [{
                "trees_planted": trees,
                "aqi_reduction": round(trees * 0.05, 1),
                "temperature_reduction_c": round(trees * 0.01, 1),
                "co2_sequestration_kg_per_year": round(trees * 22, 1)
            }],
            "timestamp": datetime.now().isoformat()
        }
    
    def _simulate_traffic_rerouting(self, action: Dict, state: Dict) -> Dict:
        """Simulate traffic rerouting"""
        return {
            "action_id": action.get("action", "TRAFFIC_REROUTING"),
            "type": "traffic_rerouting",
            "status": "simulated",
            "effects": [{
                "traffic_reduction_percent": 20.0,
                "emission_reduction_percent": 20.0,
                "aqi_reduction": 10.0
            }],
            "timestamp": datetime.now().isoformat()
        }
    
    def _simulate_generic(self, action: Dict, state: Dict) -> Dict:
        """Simulate generic action"""
        return {
            "action_id": action.get("action", "GENERIC"),
            "type": "generic",
            "status": "simulated",
            "effects": [],
            "timestamp": datetime.now().isoformat()
        }
    
    def simulate_multiple_actions(self, actions: List[Dict], state: Dict) -> Dict:
        """Simulate multiple actions and aggregate effects"""
        results = []
        total_effects = {
            "aqi_reduction": 0,
            "temperature_reduction_c": 0,
            "energy_consumption_mw": 0,
            "co2_reduction_kg": 0
        }
        
        for action in actions:
            result = self.simulate_action(action, state)
            results.append(result)
            
            # Aggregate effects
            for effect in result.get("effects", []):
                total_effects["aqi_reduction"] += effect.get("aqi_reduction", 0)
                total_effects["temperature_reduction_c"] += effect.get("temperature_reduction_c", 0)
                total_effects["energy_consumption_mw"] += effect.get("energy_consumption_mw", 0)
                total_effects["co2_reduction_kg"] += effect.get("co2_reduction_kg", 0)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "actions_simulated": len(results),
            "results": results,
            "aggregate_effects": {
                "total_aqi_reduction": round(total_effects["aqi_reduction"], 0),
                "total_temperature_reduction_c": round(total_effects["temperature_reduction_c"], 1),
                "total_energy_consumption_mw": round(total_effects["energy_consumption_mw"], 0),
                "total_co2_reduction_kg": round(total_effects["co2_reduction_kg"], 1)
            }
        }

