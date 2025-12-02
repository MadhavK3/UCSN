import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

from fastapi import APIRouter, Query
from fastapi import HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import List, Dict
from app.viewmodels.ingestion.openweather import fetch_weather
from app.viewmodels.ingestion.openweather import fetch_temperature_grid
from app.viewmodels.ingestion.openweather import fetch_weather_by_coords, reverse_geocode
from app.viewmodels.ingestion.satellite import fetch_satellite_data
import requests
from app.viewmodels.ml.uhi import run_uhi_model
from app.viewmodels.ml.flood import run_flood_model
from app.viewmodels.ml.energy import run_energy_model
from app.viewmodels.ml.green_simulation import detect_hotspots, simulate_green_interventions, control_cooling_system
from app.viewmodels.ml.coastal import run_coastal_shield_simulation, get_wave_energy_status
from app.viewmodels.ml.command_hub import get_command_hub_status, trigger_response
from pydantic import BaseModel

router = APIRouter()

@router.get("/uhimap")
def get_uhi_map(area: str = Query("Mumbai")):
    satellite_data = fetch_satellite_data(area)
    return run_uhi_model(satellite_data, city=area)

@router.get("/weather")
def get_weather(city: str = Query("Mumbai")):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    return fetch_weather(city, api_key)

@router.get("/floodalert")
def get_flood_alert(zone: str = Query("Mumbai Coastal")):
    return run_flood_model()

@router.get("/satellite")
def get_satellite(area: str = Query("Mumbai")):
    return fetch_satellite_data(area)

@router.get("/energyforecast")
def get_energy_forecast(city: str = Query("Mumbai")):
    return run_energy_model(city)

@router.get("/hotspots")
def get_hotspots(city: str = Query("Mumbai")):
    return detect_hotspots(city)


@router.get("/temperature-map")
def get_temperature_map(city: str = Query("Mumbai"), grid_size: int = Query(3), spacing_km: float = Query(5.0)):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    return fetch_temperature_grid(city, api_key, grid_size=grid_size, spacing_km=spacing_km)

@router.get("/owm-enabled")
def owm_enabled():
    return {"enabled": bool(os.getenv("OPENWEATHER_API_KEY"))}

@router.get("/temperature-tile/{layer}/{z}/{x}/{y}.png")
def proxy_temperature_tile(layer: str, z: int, x: int, y: int):
    """Proxy OpenWeather map tiles so the frontend doesn't need the API key."""
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=404, detail="OpenWeather API key not configured")

    tile_url = f"https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}"
    try:
        resp = requests.get(tile_url, stream=True, timeout=10)
        resp.raise_for_status()
        return StreamingResponse(resp.raw, media_type=resp.headers.get('Content-Type', 'image/png'))
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/weather-by-coords")
def get_weather_by_coords(lat: float = Query(...), lon: float = Query(...)):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    return fetch_weather_by_coords(lat, lon, api_key)


@router.get("/reverse-geocode")
def get_reverse_geocode(lat: float = Query(...), lon: float = Query(...)):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    return reverse_geocode(lat, lon, api_key)

@router.post("/green-simulate")
def post_green_simulate(city: str = Query("Mumbai"), trees: int = Query(100), reflective_paint: bool = Query(True), green_roofs: bool = Query(True), coastal_barriers: bool = Query(False), lat: float = Query(19.0760), lon: float = Query(72.8777)):
    hotspots = detect_hotspots(city, lat, lon)
    simulation_result = simulate_green_interventions(hotspots, trees, reflective_paint, green_roofs, coastal_barriers, lat, lon)
    
    # Add carbon and cost analysis
    from app.viewmodels.ml.carbon_tracker import calculate_carbon_offset
    from app.viewmodels.ml.cost_benefit import calculate_intervention_cba
    
    # Estimate areas (simplified)
    paint_area = 1000.0 if reflective_paint else 0.0
    roof_area = 500.0 if green_roofs else 0.0
    barrier_count = 5 if coastal_barriers else 0
    
    # Calculate carbon offset
    carbon_data = calculate_carbon_offset({
        "trees": trees,
        "reflective_paint_area": paint_area,
        "green_roof_area": roof_area,
        "coastal_barriers": barrier_count
    })
    
    # Calculate cost-benefit for each intervention
    cba_results = []
    if trees > 0:
        cba_results.append(calculate_intervention_cba("tree", trees))
    if reflective_paint:
        cba_results.append(calculate_intervention_cba("reflective_paint", 0, area=paint_area))
    if green_roofs:
        cba_results.append(calculate_intervention_cba("green_roof", 0, area=roof_area))
    if coastal_barriers:
        cba_results.append(calculate_intervention_cba("coastal_barrier", barrier_count))
    
    # Aggregate CBA
    total_cost = sum(cba["initial_cost_usd"] for cba in cba_results)
    total_npv = sum(cba["npv_usd"] for cba in cba_results)
    total_roi = ((total_npv - total_cost) / total_cost * 100) if total_cost > 0 else 0
    
    simulation_result["carbon_analysis"] = carbon_data
    simulation_result["cost_benefit_analysis"] = {
        "interventions": cba_results,
        "aggregate": {
            "total_cost_usd": round(total_cost, 2),
            "total_npv_usd": round(total_npv, 2),
            "overall_roi_percent": round(total_roi, 2)
        }
    }
    
    return simulation_result

@router.post("/cooling-control")
def post_cooling_control(zone: str = Query(...), activate: bool = Query(True)):
    return control_cooling_system(zone, activate)

@router.get("/coastal/status")
def get_coastal_status(tide_level: float = 1.0, storm_surge: bool = False):
    return run_coastal_shield_simulation(tide_level, storm_surge)

@router.get("/coastal/energy")
def get_coastal_energy():
    return get_wave_energy_status()

@router.get("/command-hub/status")
def get_hub_status(city: str = Query("Mumbai")):
    return get_command_hub_status(city)

class TriggerRequest(BaseModel):
    system: str
    action: str
    target: str

@router.post("/command-hub/trigger")
def post_hub_trigger(req: TriggerRequest):
    return trigger_response(req.system, req.action, req.target)

from app.viewmodels.ai.gemini_agent import get_gemini_response
from app.viewmodels.ml.carbon_tracker import calculate_carbon_offset, calculate_energy_carbon_savings
from app.viewmodels.ml.cost_benefit import calculate_intervention_cba, optimize_intervention_mix
from app.viewmodels.ai.recommendations import generate_ai_recommendations, get_smart_recommendation_for_condition
from app.viewmodels.ml.forecasting import forecast_temperature, forecast_flood_risk, forecast_energy_demand
from app.viewmodels.ml.anomaly_detection import detect_temperature_anomalies, detect_rainfall_anomalies, detect_energy_anomalies
from app.viewmodels.ml.auto_decision import get_automated_decisions, execute_automated_decision
from app.viewmodels.ml.hazard_timeline import generate_hazard_timeline
from app.viewmodels.ml.city_risk_score import get_city_risk_scores
from app.viewmodels.ml.multi_agent_orchestrator import get_multi_agent_orchestration
from app.viewmodels.ml.policy_engine import get_policy_engine
from app.viewmodels.digital_twin.digital_twin_engine import get_digital_twin_state
from app.viewmodels.digital_twin.scenario_runner import run_scenario
from app.viewmodels.digital_twin.sensor_simulation import generate_dynamic_heatmap, generate_wind_flow_simulation
from app.viewmodels.digital_twin.orchestrator.decision_engine import VirtualDecisionEngine
from app.viewmodels.digital_twin.orchestrator.action_simulator import ActionSimulator

class ChatRequest(BaseModel):
    prompt: str

@router.post("/ai-chat")
def post_ai_chat(req: ChatRequest):
    return {"response": get_gemini_response(req.prompt)}

# Carbon Tracking Endpoints
class CarbonOffsetRequest(BaseModel):
    trees: int = 0
    reflective_paint_area: float = 0
    green_roof_area: float = 0
    coastal_barriers: int = 0
    cooling_zones: int = 0
    air_purifier_zones: int = 0
    energy_saved_kwh: float = 0

@router.post("/carbon/calculate")
def post_carbon_calculate(req: CarbonOffsetRequest):
    interventions = {
        "trees": req.trees,
        "reflective_paint_area": req.reflective_paint_area,
        "green_roof_area": req.green_roof_area,
        "coastal_barriers": req.coastal_barriers,
        "cooling_zones": req.cooling_zones,
        "air_purifier_zones": req.air_purifier_zones,
        "energy_saved_kwh": req.energy_saved_kwh
    }
    return calculate_carbon_offset(interventions)

@router.get("/carbon/energy-savings")
def get_energy_carbon_savings(energy_kwh: float = Query(...)):
    return calculate_energy_carbon_savings(energy_kwh)

# Cost-Benefit Analysis Endpoints
@router.get("/cba/intervention")
def get_cba_intervention(
    intervention_type: str = Query(...),
    quantity: float = Query(...),
    area: float = Query(None)
):
    return calculate_intervention_cba(intervention_type, quantity, area)

class BudgetOptimizationRequest(BaseModel):
    budget_usd: float
    priorities: list = None

@router.post("/cba/optimize")
def post_cba_optimize(req: BudgetOptimizationRequest):
    return optimize_intervention_mix(req.budget_usd, req.priorities)

# AI Recommendations Endpoints
@router.get("/ai/recommendations")
def get_ai_recommendations(
    city: str = Query("Mumbai"),
    budget_usd: float = Query(None)
):
    return generate_ai_recommendations(city, budget_usd)

@router.get("/ai/recommendation")
def get_smart_recommendation(
    condition_type: str = Query(...),
    severity: str = Query("medium"),
    city: str = Query("Mumbai")
):
    return get_smart_recommendation_for_condition(condition_type, severity, city)

# ML Forecasting Endpoints
@router.get("/ml/forecast/temperature")
def get_temperature_forecast(
    city: str = Query("Mumbai"),
    hours_ahead: int = Query(48)
):
    return forecast_temperature(city, hours_ahead)

@router.get("/ml/forecast/flood")
def get_flood_forecast(
    city: str = Query("Mumbai"),
    hours_ahead: int = Query(72)
):
    return forecast_flood_risk(city, hours_ahead)

@router.get("/ml/forecast/energy")
def get_energy_forecast_ml(
    city: str = Query("Mumbai"),
    hours_ahead: int = Query(24)
):
    return forecast_energy_demand(city, hours_ahead)

# Anomaly Detection Endpoints
@router.get("/ml/anomalies/temperature")
def get_temperature_anomalies(
    city: str = Query("Mumbai"),
    hours_back: int = Query(48)
):
    return detect_temperature_anomalies(city, hours_back)

@router.get("/ml/anomalies/rainfall")
def get_rainfall_anomalies(
    city: str = Query("Mumbai"),
    hours_back: int = Query(72)
):
    return detect_rainfall_anomalies(city, hours_back)

@router.get("/ml/anomalies/energy")
def get_energy_anomalies(
    city: str = Query("Mumbai"),
    hours_back: int = Query(24)
):
    return detect_energy_anomalies(city, hours_back)

# Automated Decision Engine
@router.get("/ml/auto-decisions")
def get_auto_decisions(city: str = Query("Mumbai")):
    return get_automated_decisions(city)

class DecisionExecutionRequest(BaseModel):
    decision_id: str
    approve: bool = True

@router.post("/ml/auto-decisions/execute")
def post_execute_decision(req: DecisionExecutionRequest):
    return execute_automated_decision(req.decision_id, req.approve)

# Hazard Timeline Endpoint
@router.get("/ml/hazard-timeline")
def get_hazard_timeline(
    city: str = Query("Mumbai"),
    hours_ahead: int = Query(24)
):
    return generate_hazard_timeline(city, hours_ahead)

# City Risk Score Endpoint
@router.get("/ml/city-risk-scores")
def get_city_risk_scores_endpoint(city: str = Query("Mumbai")):
    return get_city_risk_scores(city)

# Multi-Agent Orchestrator Endpoint
@router.get("/ml/multi-agent-orchestration")
def get_multi_agent_orchestration_endpoint(city: str = Query("Mumbai")):
    policy_engine = get_policy_engine()
    return get_multi_agent_orchestration(city, policy_engine)

# Digital Twin Endpoints
@router.get("/digital-twin/state")
def get_digital_twin_state_endpoint(
    region: str = Query("Anand Vihar"),
    include_projections: bool = Query(True)
):
    return get_digital_twin_state(region, include_projections)

@router.get("/digital-twin/scenario/{scenario_name}")
def get_scenario_result(
    scenario_name: str,
    region: str = Query("Anand Vihar")
):
    return run_scenario(scenario_name, region)

@router.get("/digital-twin/heatmap")
def get_dynamic_heatmap(region: str = Query("Anand Vihar")):
    from app.viewmodels.digital_twin.digital_twin_engine import DigitalTwinEngine
    engine = DigitalTwinEngine(region)
    state = engine.generate_state(include_projections=False)
    zones = state.get("zones", [])
    sensors = state.get("sensors", [])
    return generate_dynamic_heatmap(zones, sensors)

@router.get("/digital-twin/wind-flow")
def get_wind_flow(
    region: str = Query("Anand Vihar"),
    wind_speed: float = Query(5.0),
    wind_direction: float = Query(270)
):
    from app.viewmodels.digital_twin.digital_twin_engine import DigitalTwinEngine
    engine = DigitalTwinEngine(region)
    state = engine.generate_state(include_projections=False)
    zones = state.get("zones", [])
    return generate_wind_flow_simulation(zones, wind_speed, wind_direction)

@router.get("/digital-twin/3d-model")
def get_3d_model():
    import json
    import os
    model_path = os.path.join(os.path.dirname(__file__), "..", "viewmodels", "digital_twin", "3d_model", "anand_vihar_layout.json")
    with open(model_path, 'r') as f:
        return json.load(f)

@router.get("/digital-twin/buildings")
def get_buildings():
    import json
    import os
    model_path = os.path.join(os.path.dirname(__file__), "..", "viewmodels", "digital_twin", "3d_model", "building_heights.json")
    with open(model_path, 'r') as f:
        return json.load(f)

@router.get("/digital-twin/roads")
def get_roads():
    import json
    import os
    model_path = os.path.join(os.path.dirname(__file__), "..", "viewmodels", "digital_twin", "3d_model", "roads_and_flows.json")
    with open(model_path, 'r') as f:
        return json.load(f)

class ActionSimulationRequest(BaseModel):
    actions: List[Dict]

@router.post("/digital-twin/simulate-actions")
def post_simulate_actions(req: ActionSimulationRequest):
    from app.viewmodels.digital_twin.digital_twin_engine import DigitalTwinEngine
    from app.viewmodels.digital_twin.orchestrator.action_simulator import ActionSimulator
    
    engine = DigitalTwinEngine()
    state = engine.generate_state(include_projections=False)
    
    simulator = ActionSimulator()
    return simulator.simulate_multiple_actions(req.actions, state)
