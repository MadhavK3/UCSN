"""
ML-Based Anomaly Detection for Climate Events
Detects unusual patterns in temperature, rainfall, and other climate metrics
"""
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List
import math

class AnomalyDetector:
    """
    ML-based anomaly detection using statistical methods and pattern recognition
    """
    def __init__(self):
        self.threshold_multiplier = 2.5  # Standard deviations for anomaly
    
    def detect_anomalies(self, data: List[float], metric_name: str = "temperature") -> Dict:
        """
        Detect anomalies in time series data using Z-score and IQR methods
        """
        if len(data) < 10:
            return {
                "anomalies": [],
                "anomaly_count": 0,
                "severity": "Low",
                "message": "Insufficient data for anomaly detection"
            }
        
        data_array = np.array(data)
        mean = np.mean(data_array)
        std = np.std(data_array)
        
        # Z-score method
        z_scores = np.abs((data_array - mean) / std) if std > 0 else np.zeros_like(data_array)
        anomalies_z = np.where(z_scores > self.threshold_multiplier)[0]
        
        # IQR method (more robust)
        q1 = np.percentile(data_array, 25)
        q3 = np.percentile(data_array, 75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        anomalies_iqr = np.where((data_array < lower_bound) | (data_array > upper_bound))[0]
        
        # Combine both methods
        all_anomalies = set(list(anomalies_z) + list(anomalies_iqr))
        
        anomaly_details = []
        for idx in all_anomalies:
            value = data_array[idx]
            z_score = z_scores[idx]
            severity = "Critical" if z_score > 3 else "High" if z_score > 2.5 else "Medium"
            
            anomaly_details.append({
                "index": int(idx),
                "value": round(float(value), 2),
                "z_score": round(float(z_score), 2),
                "severity": severity,
                "deviation": round(float(value - mean), 2),
                "timestamp": (datetime.now() - timedelta(hours=len(data)-idx)).isoformat()
            })
        
        # Overall severity
        if len(anomaly_details) == 0:
            overall_severity = "None"
        elif any(a["severity"] == "Critical" for a in anomaly_details):
            overall_severity = "Critical"
        elif any(a["severity"] == "High" for a in anomaly_details):
            overall_severity = "High"
        else:
            overall_severity = "Medium"
        
        return {
            "metric": metric_name,
            "anomalies": sorted(anomaly_details, key=lambda x: x["z_score"], reverse=True),
            "anomaly_count": len(anomaly_details),
            "severity": overall_severity,
            "statistics": {
                "mean": round(float(mean), 2),
                "std": round(float(std), 2),
                "normal_range": [round(float(mean - 2*std), 2), round(float(mean + 2*std), 2)]
            },
            "recommendation": self._get_recommendation(overall_severity, metric_name),
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_recommendation(self, severity: str, metric: str) -> str:
        """Generate AI recommendation based on anomaly severity"""
        if severity == "Critical":
            if metric == "temperature":
                return "CRITICAL: Immediate cooling intervention required. Activate all cooling systems."
            elif metric == "rainfall":
                return "CRITICAL: Flood risk extremely high. Deploy all barriers immediately."
            else:
                return "CRITICAL: Immediate action required. Review all systems."
        elif severity == "High":
            return f"HIGH ALERT: Unusual {metric} pattern detected. Prepare intervention systems."
        elif severity == "Medium":
            return f"Monitor {metric} closely. Anomaly detected but within manageable range."
        else:
            return "All systems normal. No anomalies detected."

def detect_temperature_anomalies(city: str = "Mumbai", hours_back: int = 48) -> Dict:
    """
    Detect temperature anomalies using ML
    """
    # Simulate historical temperature data
    historical_temp = []
    for i in range(hours_back):
        hour = (datetime.now().hour - hours_back + i) % 24
        base_temp = 28.0
        temp_variation = 6.0 * math.sin((hour - 8) * math.pi / 12)
        normal_temp = base_temp + temp_variation + np.random.normal(0, 1)
        
        # Inject some anomalies
        if i == hours_back - 5:  # Simulate heat wave
            normal_temp += 8.0
        elif i == hours_back - 15:  # Simulate cold snap
            normal_temp -= 5.0
        
        historical_temp.append(normal_temp)
    
    detector = AnomalyDetector()
    result = detector.detect_anomalies(historical_temp, "temperature")
    result["city"] = city
    result["data_points"] = hours_back
    
    return result

def detect_rainfall_anomalies(city: str = "Mumbai", hours_back: int = 72) -> Dict:
    """
    Detect rainfall anomalies using ML
    """
    # Simulate historical rainfall data
    historical_rainfall = []
    for i in range(hours_back):
        base = 0.5 + np.random.exponential(2.0)
        
        # Inject anomaly (heavy rainfall event)
        if i == hours_back - 10:
            base += 45.0  # Heavy rain anomaly
        
        historical_rainfall.append(max(0, base))
    
    detector = AnomalyDetector()
    result = detector.detect_anomalies(historical_rainfall, "rainfall")
    result["city"] = city
    result["data_points"] = hours_back
    
    return result

def detect_energy_anomalies(city: str = "Mumbai", hours_back: int = 24) -> Dict:
    """
    Detect energy demand anomalies using ML
    """
    # Simulate historical energy demand
    historical_demand = []
    for i in range(hours_back):
        hour = (datetime.now().hour - hours_back + i) % 24
        base_demand = 4500
        if 8 <= hour <= 10 or 17 <= hour <= 20:
            demand = base_demand * 1.3
        else:
            demand = base_demand * 0.8
        
        # Inject anomaly (power surge)
        if i == hours_back - 3:
            demand *= 1.8
        
        historical_demand.append(demand + np.random.normal(0, 100))
    
    detector = AnomalyDetector()
    result = detector.detect_anomalies(historical_demand, "energy_demand")
    result["city"] = city
    result["data_points"] = hours_back
    
    return result

