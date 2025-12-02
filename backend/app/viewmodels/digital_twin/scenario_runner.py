"""
Scenario Simulation System
Runs predefined scenarios and simulates UCSN reactions
"""
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List
from app.viewmodels.digital_twin.digital_twin_engine import DigitalTwinEngine

class ScenarioRunner:
    """Runs climate scenarios and simulates system responses"""
    
    def __init__(self, region: str = "Anand Vihar"):
        self.region = region
        self.engine = DigitalTwinEngine(region)
        self.scenarios_dir = os.path.join(os.path.dirname(__file__), "presets")
    
    def run_scenario(self, scenario_name: str) -> Dict:
        """Run a predefined scenario"""
        scenario_file = os.path.join(self.scenarios_dir, f"{scenario_name}.json")
        
        if os.path.exists(scenario_file):
            with open(scenario_file, 'r') as f:
                scenario_config = json.load(f)
        else:
            # Use built-in scenario
            scenario_config = self._get_builtin_scenario(scenario_name)
        
        if not scenario_config:
            return {"error": f"Scenario '{scenario_name}' not found"}
        
        # Generate initial state
        state = self.engine.generate_state(include_projections=False)
        
        # Apply scenario conditions
        modified_state = self._apply_scenario_conditions(state, scenario_config)
        
        # Simulate UCSN reactions
        reactions = self._simulate_ucsn_reactions(modified_state, scenario_config)
        
        return {
            "scenario": scenario_name,
            "timestamp": datetime.now().isoformat(),
            "description": scenario_config.get("description", ""),
            "initial_conditions": scenario_config.get("conditions", {}),
            "state": modified_state,
            "ucsn_reactions": reactions,
            "impact_assessment": self._assess_impact(modified_state, reactions)
        }
    
    def _get_builtin_scenario(self, scenario_name: str) -> Dict:
        """Get built-in scenario configuration"""
        scenarios = {
            "severe_pollution_morning_peak": {
                "description": "Severe pollution during morning peak hours",
                "conditions": {
                    "time": "08:00",
                    "traffic_multiplier": 2.5,
                    "industrial_emissions": 1.5,
                    "wind_speed": 2.0,
                    "base_aqi": 180
                }
            },
            "evening_traffic_haze": {
                "description": "Evening traffic haze with high AQI",
                "conditions": {
                    "time": "18:00",
                    "traffic_multiplier": 2.5,
                    "base_aqi": 160,
                    "temperature": 32.0
                }
            },
            "heatwave_high_aqi": {
                "description": "Heatwave combined with high AQI",
                "conditions": {
                    "temperature": 40.0,
                    "base_aqi": 200,
                    "humidity": 70.0
                }
            },
            "wind_shift_event": {
                "description": "Wind shift bringing pollution from industrial zone",
                "conditions": {
                    "wind_direction": 90,
                    "wind_speed": 8.0,
                    "industrial_emissions": 2.0
                }
            },
            "winter_inversion_pollution": {
                "description": "Winter inversion layer causing pollution spike",
                "conditions": {
                    "temperature": 15.0,
                    "base_aqi": 250,
                    "wind_speed": 1.0,
                    "inversion_layer": True
                }
            },
            "tree_plantation_simulation": {
                "description": "Simulate impact of tree plantation",
                "conditions": {
                    "interventions": [
                        {"type": "tree_plantation", "trees": 500, "zones": ["zone_isbt", "zone_residential"]}
                    ]
                }
            },
            "reflective_roof_adoption": {
                "description": "Simulate reflective roof adoption",
                "conditions": {
                    "interventions": [
                        {"type": "reflective_roof", "coverage": 0.3, "zones": ["zone_commercial"]}
                    ]
                }
            },
            "cooling_node_activation": {
                "description": "Simulate cooling node activation",
                "conditions": {
                    "interventions": [
                        {"type": "cooling_node", "zones": ["zone_isbt", "zone_commercial"], "intensity": 0.8}
                    ]
                }
            }
        }
        
        return scenarios.get(scenario_name)
    
    def _apply_scenario_conditions(self, state: Dict, scenario: Dict) -> Dict:
        """Apply scenario conditions to state"""
        conditions = scenario.get("conditions", {})
        
        # Modify AQI
        if "base_aqi" in conditions:
            for zone_id in state.get("current_metrics", {}).get("aqi", {}).get("zones", {}):
                state["current_metrics"]["aqi"]["zones"][zone_id]["aqi"] = conditions["base_aqi"]
        
        # Modify temperature
        if "temperature" in conditions:
            for zone_id in state.get("current_metrics", {}).get("heat_island", {}).get("zones", {}):
                state["current_metrics"]["heat_island"]["zones"][zone_id]["temperature"] = conditions["temperature"]
        
        # Apply interventions
        if "interventions" in conditions:
            state["interventions"] = conditions["interventions"]
        
        return state
    
    def _simulate_ucsn_reactions(self, state: Dict, scenario: Dict) -> List[Dict]:
        """Simulate UCSN system reactions to scenario"""
        reactions = []
        
        # Check AQI levels
        avg_aqi = state.get("current_metrics", {}).get("aqi", {}).get("average_aqi", 80)
        if avg_aqi > 200:
            reactions.append({
                "action": "ACTIVATE_ALL_AIR_PURIFIERS",
                "priority": "CRITICAL",
                "zones": "All zones",
                "reason": f"AQI {avg_aqi} exceeds critical threshold",
                "timestamp": datetime.now().isoformat()
            })
        elif avg_aqi > 150:
            reactions.append({
                "action": "ACTIVATE_PRIORITY_AIR_PURIFIERS",
                "priority": "HIGH",
                "zones": "High-traffic zones",
                "reason": f"AQI {avg_aqi} is unhealthy",
                "timestamp": datetime.now().isoformat()
            })
        
        # Check temperature
        avg_temp = state.get("current_metrics", {}).get("heat_island", {}).get("average_temperature", 30.0)
        if avg_temp > 38:
            reactions.append({
                "action": "ACTIVATE_ALL_COOLING_NODES",
                "priority": "CRITICAL",
                "zones": "All hotspot zones",
                "reason": f"Temperature {avg_temp}°C exceeds critical threshold",
                "timestamp": datetime.now().isoformat()
            })
        elif avg_temp > 35:
            reactions.append({
                "action": "ACTIVATE_PRIORITY_COOLING_NODES",
                "priority": "HIGH",
                "zones": "High-priority zones",
                "reason": f"Temperature {avg_temp}°C approaching critical",
                "timestamp": datetime.now().isoformat()
            })
        
        # Check for interventions in scenario
        interventions = state.get("interventions", [])
        for intervention in interventions:
            if intervention["type"] == "tree_plantation":
                reactions.append({
                    "action": "DEPLOY_TREE_PLANTATION",
                    "priority": "MEDIUM",
                    "zones": intervention.get("zones", []),
                    "reason": f"Planting {intervention.get('trees', 0)} trees",
                    "timestamp": datetime.now().isoformat()
                })
            elif intervention["type"] == "cooling_node":
                reactions.append({
                    "action": "ACTIVATE_COOLING_NODES",
                    "priority": "HIGH",
                    "zones": intervention.get("zones", []),
                    "reason": "Cooling node activation",
                    "timestamp": datetime.now().isoformat()
                })
        
        return reactions
    
    def _assess_impact(self, state: Dict, reactions: List[Dict]) -> Dict:
        """Assess impact of scenario and reactions"""
        initial_aqi = state.get("current_metrics", {}).get("aqi", {}).get("average_aqi", 80)
        initial_temp = state.get("current_metrics", {}).get("heat_island", {}).get("average_temperature", 30.0)
        
        # Estimate impact of reactions
        aqi_reduction = 0
        temp_reduction = 0
        
        for reaction in reactions:
            if "AIR_PURIFIER" in reaction["action"]:
                aqi_reduction += 20 if "ALL" in reaction["action"] else 10
            if "COOLING" in reaction["action"]:
                temp_reduction += 2.0 if "ALL" in reaction["action"] else 1.0
        
        return {
            "initial_conditions": {
                "aqi": round(initial_aqi, 0),
                "temperature": round(initial_temp, 1)
            },
            "estimated_impact": {
                "aqi_reduction": round(aqi_reduction, 0),
                "temperature_reduction": round(temp_reduction, 1),
                "projected_aqi": round(max(0, initial_aqi - aqi_reduction), 0),
                "projected_temperature": round(max(20, initial_temp - temp_reduction), 1)
            },
            "reactions_count": len(reactions),
            "critical_actions": sum(1 for r in reactions if r.get("priority") == "CRITICAL")
        }

def run_scenario(scenario_name: str, region: str = "Anand Vihar") -> Dict:
    """Run a scenario"""
    runner = ScenarioRunner(region)
    return runner.run_scenario(scenario_name)

