"""
AI-Powered Automated Decision Engine
Uses ML models to automatically trigger interventions based on predictions and anomalies
"""
from datetime import datetime
from typing import Dict, List
from app.viewmodels.ml.forecasting import forecast_temperature, forecast_flood_risk
from app.viewmodels.ml.anomaly_detection import detect_temperature_anomalies, detect_rainfall_anomalies
from app.viewmodels.ml.command_hub import get_command_hub_status

class AutoDecisionEngine:
    """
    ML-based automated decision-making system
    Analyzes predictions, anomalies, and current conditions to make intervention decisions
    """
    
    def __init__(self):
        self.decision_thresholds = {
            "temperature_critical": 38.0,
            "temperature_high": 35.0,
            "flood_risk_high": "High",
            "anomaly_critical": "Critical"
        }
        self.decision_history = []
    
    def analyze_and_decide(self, city: str = "Mumbai") -> Dict:
        """
        Main decision function: analyzes all data sources and makes automated decisions
        """
        # Get current status
        current_status = get_command_hub_status(city)
        
        # Get forecasts
        temp_forecast = forecast_temperature(city, hours_ahead=24)
        flood_forecast = forecast_flood_risk(city, hours_ahead=48)
        
        # Get anomaly detection
        temp_anomalies = detect_temperature_anomalies(city)
        rainfall_anomalies = detect_rainfall_anomalies(city)
        
        # Decision logic using ML predictions
        decisions = []
        confidence_scores = []
        
        # Decision 1: Temperature-based cooling
        current_temp = current_status["subsystems"]["uhi"]["average_temp"]
        predicted_max = temp_forecast["statistics"]["maximum"]
        
        if predicted_max > self.decision_thresholds["temperature_critical"]:
            decisions.append({
                "action": "ACTIVATE_COOLING_SYSTEMS",
                "priority": "CRITICAL",
                "reason": f"Predicted temperature {predicted_max}°C exceeds critical threshold",
                "target": "All hotspot zones",
                "confidence": 0.95,
                "ml_model": "Temperature Forecast LSTM"
            })
            confidence_scores.append(0.95)
        elif predicted_max > self.decision_thresholds["temperature_high"]:
            decisions.append({
                "action": "PREPARE_COOLING_SYSTEMS",
                "priority": "HIGH",
                "reason": f"Predicted temperature {predicted_max}°C approaching critical",
                "target": "High-priority zones",
                "confidence": 0.85,
                "ml_model": "Temperature Forecast LSTM"
            })
            confidence_scores.append(0.85)
        
        # Decision 2: Flood risk-based barriers
        flood_risk = flood_forecast["risk_assessment"]["overall_risk"]
        if flood_risk == self.decision_thresholds["flood_risk_high"]:
            decisions.append({
                "action": "ACTIVATE_COASTAL_BARRIERS",
                "priority": "CRITICAL",
                "reason": f"ML model predicts {flood_risk} flood risk",
                "target": "Coastal zones",
                "confidence": 0.89,
                "ml_model": "Flood Risk Forecast Model"
            })
            confidence_scores.append(0.89)
        
        # Decision 3: Anomaly-based interventions
        if temp_anomalies["severity"] == "Critical":
            decisions.append({
                "action": "EMERGENCY_COOLING",
                "priority": "CRITICAL",
                "reason": f"Anomaly detection: {temp_anomalies['anomaly_count']} critical temperature anomalies",
                "target": "Anomaly zones",
                "confidence": 0.92,
                "ml_model": "Anomaly Detection System"
            })
            confidence_scores.append(0.92)
        
        if rainfall_anomalies["severity"] in ["High", "Critical"]:
            decisions.append({
                "action": "PREPARE_FLOOD_DEFENSE",
                "priority": rainfall_anomalies["severity"].upper(),
                "reason": f"Anomaly detection: Unusual rainfall pattern detected",
                "target": "Flood-prone areas",
                "confidence": 0.88,
                "ml_model": "Anomaly Detection System"
            })
            confidence_scores.append(0.88)
        
        # Overall confidence
        overall_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.0
        
        # Decision summary
        critical_count = sum(1 for d in decisions if d["priority"] == "CRITICAL")
        high_count = sum(1 for d in decisions if d["priority"] == "HIGH")
        
        return {
            "city": city,
            "timestamp": datetime.now().isoformat(),
            "decisions": decisions,
            "decision_count": len(decisions),
            "overall_confidence": round(overall_confidence, 2),
            "summary": {
                "critical_actions": critical_count,
                "high_priority_actions": high_count,
                "total_actions": len(decisions)
            },
            "data_sources": {
                "temperature_forecast": {
                    "model": "LSTM",
                    "accuracy": temp_forecast["model_info"]["accuracy"],
                    "predicted_max": temp_forecast["statistics"]["maximum"]
                },
                "flood_forecast": {
                    "model": "ML Flood Prediction",
                    "accuracy": flood_forecast["model_info"]["accuracy"],
                    "risk_level": flood_forecast["risk_assessment"]["overall_risk"]
                },
                "anomaly_detection": {
                    "temperature_anomalies": temp_anomalies["anomaly_count"],
                    "rainfall_anomalies": rainfall_anomalies["anomaly_count"]
                }
            },
            "recommendation": self._generate_recommendation(decisions, overall_confidence)
        }
    
    def _generate_recommendation(self, decisions: List[Dict], confidence: float) -> str:
        """Generate AI recommendation based on decisions"""
        if not decisions:
            return "All systems operating normally. No automated interventions required."
        
        critical = [d for d in decisions if d["priority"] == "CRITICAL"]
        if critical:
            return f"CRITICAL: {len(critical)} critical intervention(s) recommended with {confidence*100:.0f}% confidence. Immediate action required."
        
        return f"{len(decisions)} intervention(s) recommended with {confidence*100:.0f}% confidence. Review and approve actions."

def get_automated_decisions(city: str = "Mumbai") -> Dict:
    """
    Get AI-powered automated decisions
    """
    engine = AutoDecisionEngine()
    return engine.analyze_and_decide(city)

def execute_automated_decision(decision_id: str, approve: bool = True) -> Dict:
    """
    Execute an automated decision (simulated)
    """
    return {
        "decision_id": decision_id,
        "status": "EXECUTED" if approve else "REJECTED",
        "timestamp": datetime.now().isoformat(),
        "message": "Automated intervention activated successfully" if approve else "Decision rejected by operator"
    }

