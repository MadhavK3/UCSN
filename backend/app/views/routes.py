import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

from fastapi import APIRouter, Query
from fastapi import HTTPException, Response
from fastapi.responses import StreamingResponse
from app.viewmodels.ingestion.openweather import fetch_weather
from app.viewmodels.ingestion.openweather import fetch_temperature_grid
from app.viewmodels.ingestion.openweather import fetch_weather_by_coords, reverse_geocode
from app.viewmodels.ingestion.satellite import fetch_satellite_data
import requests
from app.viewmodels.ml.uhi import run_uhi_model
from app.viewmodels.ml.flood import run_flood_model
from app.viewmodels.ml.energy import run_energy_model
from app.viewmodels.ml.green_simulation import detect_hotspots, simulate_green_interventions, control_cooling_system

router = APIRouter()

@router.get("/uhimap")
def get_uhi_map(area: str = Query("Mumbai")):
    satellite_data = fetch_satellite_data(area)
    return run_uhi_model(satellite_data)

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
def post_green_simulate(city: str = Query("Mumbai"), trees: int = Query(100), reflective_paint: bool = Query(True), green_roofs: bool = Query(True)):
    hotspots = detect_hotspots(city)
    return simulate_green_interventions(hotspots, trees, reflective_paint, green_roofs)

@router.post("/cooling-control")
def post_cooling_control(zone: str = Query(...), activate: bool = Query(True)):
    return control_cooling_system(zone, activate)
