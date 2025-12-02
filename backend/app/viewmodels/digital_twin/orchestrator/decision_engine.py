"""
UCSN Decision Engine for Virtual Actions
Makes decisions about virtual interventions
"""
from datetime import datetime
from typing import Dict, List
from app.viewmodels.ml.auto_decision import get_automated_decisions

class VirtualDecisionEngine:
    """Decision engine for virtual interventions"""
    
    def __init__(self):
        self.decision_history = []
    
    def make_decision(self, state: Dict) -> Dict:
        """Make decision based on current state"""
        # Use existing auto-decision system
        city = state.get("region", "Anand Vihar")
        decisions = get_automated_decisions(city)
        
        # Convert to virtual actions
        virtual_actions = []
        for decision in decisions.get("decisions", []):
            virtual_action = self._convert_to_virtual_action(decision, state)
            virtual_actions.append(virtual_action)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "decisions": virtual_actions,
            "confidence": decisions.get("overall_confidence", 0.0),
            "total_actions": len(virtual_actions)
        }
    
    def _convert_to_virtual_action(self, decision: Dict, state: Dict) -> Dict:
        """Convert decision to virtual action"""
        action_type = decision.get("action", "")
        
        if "COOLING" in action_type:
            return {
                "type": "virtual_cooling_node",
                "action": decision.get("action"),
                "zones": decision.get("target", "All zones"),
                "intensity": 0.8,
                "energy_consumption_mw": 150,
                "cooling_effect_c": 2.0,
                "status": "activated",
                "virtual": True
            }
        elif "BARRIER" in action_type or "SHIELD" in action_type:
            return {
                "type": "virtual_coastal_shield",
                "action": decision.get("action"),
                "zones": decision.get("target", "Coastal zones"),
                "status": "deployed",
                "virtual": True
            }
        elif "AIR" in action_type or "PURIFIER" in action_type:
            return {
                "type": "virtual_air_purifier",
                "action": decision.get("action"),
                "zones": decision.get("target", "All zones"),
                "aqi_reduction": 20,
                "energy_consumption_mw": 100,
                "status": "activated",
                "virtual": True
            }
        else:
            return {
                "type": "virtual_intervention",
                "action": decision.get("action"),
                "zones": decision.get("target", "Unknown"),
                "status": "pending",
                "virtual": True
            }

