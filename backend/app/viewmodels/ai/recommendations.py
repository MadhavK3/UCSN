"""
AI-Powered Recommendations Engine
Analyzes current conditions and suggests optimal interventions
"""
import os
from app.viewmodels.ai.gemini_agent import get_gemini_response
from app.viewmodels.ml.command_hub import get_command_hub_status
from app.viewmodels.ml.green_simulation import detect_hotspots
from app.viewmodels.ml.cost_benefit import optimize_intervention_mix
from datetime import datetime
from typing import Dict, List

def generate_ai_recommendations(city: str = "Mumbai", budget_usd: float = None) -> Dict:
    """
    Generate AI-powered recommendations based on current city status
    
    Args:
        city: City name
        budget_usd: Optional budget constraint
    
    Returns:
        Dictionary with AI recommendations
    """
    # Get current status
    hub_status = get_command_hub_status(city)
    hotspots = detect_hotspots(city)
    
    # Extract key metrics
    avg_temp = hub_status["subsystems"]["uhi"]["average_temp"]
    flood_risk = hub_status["subsystems"]["flood"]["risk"]
    aqi = hub_status["subsystems"]["air_quality"]["aqi"]
    alert_level = hub_status["alert_level"]
    
    # Build context for AI
    context = f"""
    Current City Status for {city}:
    - Average Temperature: {avg_temp}°C
    - Flood Risk: {flood_risk}
    - Air Quality Index: {aqi}
    - Alert Level: {alert_level}
    - Hotspots Detected: {len(hotspots)}
    
    Current Conditions Analysis:
    """
    
    # Add condition-specific analysis
    recommendations_list = []
    priority_score = 0
    
    # Temperature-based recommendations
    if avg_temp > 35:
        priority_score += 3
        recommendations_list.append({
            "type": "cooling",
            "priority": "HIGH",
            "intervention": "Deploy Cooling Misting Systems",
            "zones": len(hotspots),
            "expected_impact": f"Reduce temperature by 2-3°C in {len(hotspots)} hotspot zones",
            "urgency": "Immediate" if avg_temp > 38 else "High"
        })
        recommendations_list.append({
            "type": "green_infrastructure",
            "priority": "MEDIUM",
            "intervention": "Plant Trees in Hotspot Areas",
            "quantity": min(200, len(hotspots) * 50),
            "expected_impact": "Long-term temperature reduction of 1-2°C",
            "urgency": "Medium-term"
        })
    
    # Flood-based recommendations
    if flood_risk == "High":
        priority_score += 4
        recommendations_list.append({
            "type": "coastal_protection",
            "priority": "CRITICAL",
            "intervention": "Activate Coastal Barriers",
            "zones": "Coastal areas",
            "expected_impact": "Protect against storm surge and flooding",
            "urgency": "Immediate"
        })
    elif flood_risk == "Medium":
        priority_score += 2
        recommendations_list.append({
            "type": "monitoring",
            "priority": "MEDIUM",
            "intervention": "Enhanced Flood Monitoring",
            "expected_impact": "Early warning system activation",
            "urgency": "Monitor closely"
        })
    
    # Air quality recommendations
    if aqi > 150:
        priority_score += 2
        recommendations_list.append({
            "type": "air_quality",
            "priority": "HIGH",
            "intervention": "Activate Air Purification Systems",
            "zones": "City center and high-traffic areas",
            "expected_impact": f"Reduce AQI by 20-30 points",
            "urgency": "High" if aqi > 200 else "Medium"
        })
        recommendations_list.append({
            "type": "green_infrastructure",
            "priority": "MEDIUM",
            "intervention": "Install Green Roofs",
            "expected_impact": "Natural air filtration and cooling",
            "urgency": "Medium-term"
        })
    
    # General recommendations if no critical issues
    if priority_score == 0:
        recommendations_list.append({
            "type": "preventive",
            "priority": "LOW",
            "intervention": "Maintain Current Systems",
            "expected_impact": "Sustain optimal climate conditions",
            "urgency": "Ongoing"
        })
        recommendations_list.append({
            "type": "optimization",
            "priority": "LOW",
            "intervention": "Optimize Existing Green Infrastructure",
            "expected_impact": "Improve efficiency and reduce costs",
            "urgency": "Low"
        })
    
    # Get AI-generated insights using Gemini
    ai_prompt = f"""
    As an AI climate resilience expert, analyze this city status and provide 2-3 strategic recommendations:
    
    {context}
    
    Provide recommendations that are:
    1. Actionable and specific
    2. Prioritized by impact and urgency
    3. Cost-effective
    4. Aligned with climate resilience goals
    
    Format as concise bullet points.
    """
    
    try:
        ai_insights = get_gemini_response(ai_prompt)
    except:
        ai_insights = "AI analysis temporarily unavailable. Using rule-based recommendations."
    
    # If budget provided, get optimized mix
    optimization = None
    if budget_usd:
        optimization = optimize_intervention_mix(budget_usd)
    
    return {
        "city": city,
        "timestamp": datetime.now().isoformat(),
        "current_status": {
            "temperature": avg_temp,
            "flood_risk": flood_risk,
            "air_quality": aqi,
            "alert_level": alert_level
        },
        "priority_score": priority_score,
        "recommendations": recommendations_list,
        "ai_insights": ai_insights,
        "optimized_budget_allocation": optimization,
        "total_recommendations": len(recommendations_list)
    }

def get_smart_recommendation_for_condition(condition_type: str, severity: str, city: str = "Mumbai") -> Dict:
    """
    Get a single smart recommendation for a specific condition
    
    Args:
        condition_type: "temperature", "flood", "air_quality", "energy"
        severity: "low", "medium", "high", "critical"
        city: City name
    
    Returns:
        Single focused recommendation
    """
    hub_status = get_command_hub_status(city)
    
    if condition_type == "temperature":
        temp = hub_status["subsystems"]["uhi"]["average_temp"]
        if severity in ["high", "critical"] or temp > 35:
            return {
                "recommendation": "Deploy Cooling Misting Systems",
                "rationale": f"Temperature at {temp}°C exceeds comfort threshold",
                "expected_impact": "2-3°C reduction in affected zones",
                "implementation_time": "Immediate (automated)",
                "cost_estimate_usd": 8000 * hub_status["subsystems"]["uhi"]["hotspots_count"]
            }
    
    elif condition_type == "flood":
        risk = hub_status["subsystems"]["flood"]["risk"]
        if severity in ["high", "critical"] or risk == "High":
            return {
                "recommendation": "Activate Coastal Barriers",
                "rationale": f"Flood risk level: {risk}",
                "expected_impact": "Protection against storm surge",
                "implementation_time": "Immediate (automated)",
                "cost_estimate_usd": 5000 * 5  # 5 barrier units
            }
    
    elif condition_type == "air_quality":
        aqi = hub_status["subsystems"]["air_quality"]["aqi"]
        if severity in ["high", "critical"] or aqi > 150:
            return {
                "recommendation": "Activate Air Purification Systems",
                "rationale": f"AQI at {aqi} exceeds healthy levels",
                "expected_impact": "20-30 point AQI reduction",
                "implementation_time": "Immediate (automated)",
                "cost_estimate_usd": 5000 * 3  # 3 zones
            }
    
    return {
        "recommendation": "Monitor Conditions",
        "rationale": "Current conditions are within acceptable ranges",
        "expected_impact": "Maintain status quo",
        "implementation_time": "Ongoing"
    }

