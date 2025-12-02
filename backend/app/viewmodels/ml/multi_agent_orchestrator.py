"""
Multi-Agent Orchestrator
Coordinates Heat, Flood, AQI, and Energy agents with conflict resolution
"""
from datetime import datetime
from typing import Dict, List, Optional
from app.viewmodels.ml.command_hub import get_command_hub_status
from app.viewmodels.ml.forecasting import forecast_temperature, forecast_flood_risk
from app.viewmodels.ml.anomaly_detection import detect_temperature_anomalies, detect_rainfall_anomalies

class Agent:
    """Base agent class"""
    def __init__(self, name: str, priority: int):
        self.name = name
        self.priority = priority  # Lower number = higher priority
        self.status = "active"
        self.last_action = None
    
    def analyze(self, context: Dict) -> Dict:
        """Analyze current situation and recommend actions"""
        raise NotImplementedError
    
    def get_actions(self) -> List[Dict]:
        """Get recommended actions"""
        raise NotImplementedError

class HeatAgent(Agent):
    """Agent responsible for heat management"""
    def __init__(self):
        super().__init__("Heat Agent", priority=1)  # Highest priority
    
    def analyze(self, context: Dict) -> Dict:
        temp = context.get("temperature", 30.0)
        forecast = context.get("temp_forecast")
        anomalies = context.get("temp_anomalies", {})
        
        risk_level = "Low"
        if temp > 38 or (forecast and forecast.get("statistics", {}).get("maximum", 0) > 38):
            risk_level = "Critical"
        elif temp > 35 or (forecast and forecast.get("statistics", {}).get("maximum", 0) > 35):
            risk_level = "High"
        elif temp > 32:
            risk_level = "Medium"
        
        return {
            "agent": self.name,
            "risk_level": risk_level,
            "current_temp": temp,
            "anomalies_detected": anomalies.get("anomaly_count", 0),
            "recommended_actions": self._get_actions(risk_level, temp)
        }
    
    def _get_actions(self, risk_level: str, temp: float) -> List[Dict]:
        actions = []
        if risk_level == "Critical":
            actions.append({
                "action": "ACTIVATE_ALL_COOLING",
                "priority": "CRITICAL",
                "zones": "All hotspot zones",
                "energy_impact_mw": 300,
                "reason": f"Temperature {temp}°C exceeds critical threshold"
            })
        elif risk_level == "High":
            actions.append({
                "action": "ACTIVATE_PRIORITY_COOLING",
                "priority": "HIGH",
                "zones": "High-priority zones",
                "energy_impact_mw": 150,
                "reason": f"Temperature {temp}°C approaching critical"
            })
        return actions

class FloodAgent(Agent):
    """Agent responsible for flood/coastal management"""
    def __init__(self):
        super().__init__("Flood Agent", priority=2)
    
    def analyze(self, context: Dict) -> Dict:
        flood_risk = context.get("flood_risk", "Low")
        forecast = context.get("flood_forecast", {})
        anomalies = context.get("rainfall_anomalies", {})
        
        risk_level = flood_risk
        if forecast.get("risk_assessment", {}).get("overall_risk") == "High":
            risk_level = "High"
        
        return {
            "agent": self.name,
            "risk_level": risk_level,
            "current_risk": flood_risk,
            "anomalies_detected": anomalies.get("anomaly_count", 0),
            "recommended_actions": self._get_actions(risk_level, forecast)
        }
    
    def _get_actions(self, risk_level: str, forecast: Dict) -> List[Dict]:
        actions = []
        if risk_level == "High":
            actions.append({
                "action": "RAISE_COASTAL_BARRIERS",
                "priority": "CRITICAL",
                "zones": "Coastal zones",
                "energy_impact_mw": 200,
                "reason": "High flood risk detected"
            })
        elif risk_level == "Medium":
            actions.append({
                "action": "PREPARE_BARRIERS",
                "priority": "MEDIUM",
                "zones": "Coastal zones",
                "energy_impact_mw": 0,
                "reason": "Medium flood risk - prepare for activation"
            })
        return actions

class AQIAgent(Agent):
    """Agent responsible for air quality management"""
    def __init__(self):
        super().__init__("AQI Agent", priority=3)
    
    def analyze(self, context: Dict) -> Dict:
        aqi = context.get("aqi", 80)
        
        risk_level = "Low"
        if aqi > 200:
            risk_level = "Critical"
        elif aqi > 150:
            risk_level = "High"
        elif aqi > 100:
            risk_level = "Medium"
        
        return {
            "agent": self.name,
            "risk_level": risk_level,
            "current_aqi": aqi,
            "recommended_actions": self._get_actions(risk_level, aqi)
        }
    
    def _get_actions(self, risk_level: str, aqi: float) -> List[Dict]:
        actions = []
        if risk_level == "Critical":
            actions.append({
                "action": "ACTIVATE_ALL_AIR_PURIFIERS",
                "priority": "CRITICAL",
                "zones": "All zones",
                "energy_impact_mw": 250,
                "reason": f"AQI {aqi} exceeds critical threshold"
            })
        elif risk_level == "High":
            actions.append({
                "action": "ACTIVATE_PRIORITY_PURIFIERS",
                "priority": "HIGH",
                "zones": "High-traffic zones",
                "energy_impact_mw": 150,
                "reason": f"AQI {aqi} is unhealthy"
            })
        return actions

class EnergyAgent(Agent):
    """Agent responsible for energy grid management"""
    def __init__(self):
        super().__init__("Energy Agent", priority=4)  # Lowest priority (supports others)
    
    def analyze(self, context: Dict) -> Dict:
        current_load = context.get("energy_load", 4500)
        max_capacity = 6000  # MW
        utilization = current_load / max_capacity
        
        risk_level = "Low"
        if utilization > 0.95:
            risk_level = "Critical"
        elif utilization > 0.85:
            risk_level = "High"
        elif utilization > 0.75:
            risk_level = "Medium"
        
        return {
            "agent": self.name,
            "risk_level": risk_level,
            "current_load_mw": current_load,
            "utilization": round(utilization * 100, 1),
            "available_capacity_mw": max_capacity - current_load,
            "recommended_actions": self._get_actions(risk_level, utilization)
        }
    
    def _get_actions(self, risk_level: str, utilization: float) -> List[Dict]:
        actions = []
        if risk_level == "Critical":
            actions.append({
                "action": "REDUCE_NON_CRITICAL_LOAD",
                "priority": "CRITICAL",
                "zones": "All zones",
                "energy_impact_mw": -200,  # Negative = reduction
                "reason": f"Grid utilization {utilization*100:.1f}% - critical"
            })
        elif risk_level == "High":
            actions.append({
                "action": "OPTIMIZE_ENERGY_USAGE",
                "priority": "MEDIUM",
                "zones": "All zones",
                "energy_impact_mw": -100,
                "reason": f"Grid utilization {utilization*100:.1f}% - high"
            })
        return actions

class CoordinatorBrain:
    """
    Central coordinator that resolves conflicts between agents
    """
    def __init__(self):
        self.agents = [
            HeatAgent(),
            FloodAgent(),
            AQIAgent(),
            EnergyAgent()
        ]
        self.policy_engine = None  # Will be set by PolicyEngine
    
    def orchestrate(self, city: str = "Mumbai", policy_engine=None) -> Dict:
        """
        Orchestrate all agents and resolve conflicts
        """
        self.policy_engine = policy_engine
        
        # Get current context
        hub_status = get_command_hub_status(city)
        temp_forecast = forecast_temperature(city, hours_ahead=24)
        flood_forecast = forecast_flood_risk(city, hours_ahead=48)
        temp_anomalies = detect_temperature_anomalies(city)
        rainfall_anomalies = detect_rainfall_anomalies(city)
        
        context = {
            "temperature": hub_status["subsystems"]["uhi"]["average_temp"],
            "flood_risk": hub_status["subsystems"]["flood"]["risk"],
            "aqi": hub_status["subsystems"]["air_quality"]["aqi"],
            "energy_load": hub_status["subsystems"]["energy"]["forecast"]["peak_demand"],
            "temp_forecast": temp_forecast,
            "flood_forecast": flood_forecast,
            "temp_anomalies": temp_anomalies,
            "rainfall_anomalies": rainfall_anomalies
        }
        
        # Get recommendations from all agents
        agent_analyses = []
        all_actions = []
        
        for agent in sorted(self.agents, key=lambda x: x.priority):
            analysis = agent.analyze(context)
            agent_analyses.append(analysis)
            all_actions.extend(analysis.get("recommended_actions", []))
        
        # Resolve conflicts using policy engine
        if policy_engine:
            resolved_actions = policy_engine.resolve_conflicts(all_actions, context)
        else:
            resolved_actions = self._simple_resolve(all_actions, context)
        
        # Calculate total energy impact
        total_energy_impact = sum(a.get("energy_impact_mw", 0) for a in resolved_actions)
        
        return {
            "city": city,
            "timestamp": datetime.now().isoformat(),
            "orchestration_status": "active",
            "agents": [
                {
                    "name": a.name,
                    "priority": a.priority,
                    "status": a.status,
                    "analysis": next((ag for ag in agent_analyses if ag["agent"] == a.name), {})
                }
                for a in self.agents
            ],
            "conflicts_detected": len(all_actions) - len(resolved_actions),
            "resolved_actions": resolved_actions,
            "total_energy_impact_mw": total_energy_impact,
            "coordination_summary": {
                "active_agents": len([a for a in self.agents if a.status == "active"]),
                "total_recommendations": len(resolved_actions),
                "critical_actions": sum(1 for a in resolved_actions if a.get("priority") == "CRITICAL"),
                "high_priority_actions": sum(1 for a in resolved_actions if a.get("priority") == "HIGH")
            }
        }
    
    def _simple_resolve(self, actions: List[Dict], context: Dict) -> List[Dict]:
        """Simple conflict resolution (prioritize by agent priority)"""
        # Sort by priority (CRITICAL > HIGH > MEDIUM)
        priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        actions.sort(key=lambda x: priority_order.get(x.get("priority", "LOW"), 3))
        
        # Simple deduplication
        seen_actions = set()
        resolved = []
        for action in actions:
            action_key = f"{action.get('action')}_{action.get('zones')}"
            if action_key not in seen_actions:
                seen_actions.add(action_key)
                resolved.append(action)
        
        return resolved

def get_multi_agent_orchestration(city: str = "Mumbai", policy_engine=None) -> Dict:
    """
    Get multi-agent orchestration results
    """
    coordinator = CoordinatorBrain()
    return coordinator.orchestrate(city, policy_engine)

