import os
import math
import requests

def fetch_weather(city: str, api_key: str = None):
    """Fetch weather from OpenWeather when api_key provided, otherwise return a synthetic fallback.

    This reduces reliance on an external API for development and demo runs.
    """
    if not api_key:
        # Synthetic fallback data for offline/demo use
        return {
            "city": city,
            "temperature": 298.15,
            "weather": "Clear",
            "source": "synthetic"
        }

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        data["source"] = "openweathermap"
        return data
    except Exception as e:
        # On error, return a small fallback so callers can continue to operate
        return {"city": city, "error": str(e), "source": "fallback"}


def fetch_temperature_grid(city: str, api_key: str = None, grid_size: int = 3, spacing_km: float = 5.0):
    """Return a small grid of temperature points around the given city.

    If an OpenWeather API key is provided the function will geocode the city and
    call the OpenWeather current weather endpoint for each grid point. When no
    key is available this returns a synthetic grid (useful for demos/offline).
    """
    # Ensure grid_size is odd
    if grid_size % 2 == 0:
        grid_size += 1

    half = grid_size // 2

    # Default fallback center (Mumbai) if geocoding is not possible
    default_center = (19.0760, 72.8777)

    if not api_key:
        # Synthetic grid around default_center
        center_lat, center_lon = default_center
        points = []
        for i in range(-half, half + 1):
            for j in range(-half, half + 1):
                # small random variation
                lat = center_lat + (i * 0.01) + (0.005 * (j % 2))
                lon = center_lon + (j * 0.01) + (0.005 * (i % 2))
                temp_c = 28 + (i * 0.8) + (j * 0.5)  # synthetic Celsius
                points.append({"lat": lat, "lng": lon, "temp_c": round(temp_c, 2), "source": "synthetic"})

        return {"city": city, "points": points}

    try:
        # Geocode the city to get a center latitude/longitude
        geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
        gresp = requests.get(geocode_url, timeout=5)
        gresp.raise_for_status()
        gdata = gresp.json()
        if not gdata:
            center_lat, center_lon = default_center
        else:
            center_lat = float(gdata[0].get("lat", default_center[0]))
            center_lon = float(gdata[0].get("lon", default_center[1]))

        # Convert spacing from km to degrees approx
        delta_lat = spacing_km / 111.0
        # Use latitude to scale longitude degrees
        delta_lon = spacing_km / (111.0 * max(0.0001, math.cos(math.radians(center_lat))))

        points = []
        for i in range(-half, half + 1):
            for j in range(-half, half + 1):
                lat = center_lat + (i * delta_lat)
                lon = center_lon + (j * delta_lon)
                try:
                    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
                    resp = requests.get(url, timeout=5)
                    resp.raise_for_status()
                    w = resp.json()
                    # temperature in Kelvin -> Celsius
                    temp_k = w.get("main", {}).get("temp")
                    temp_c = None
                    if temp_k is not None:
                        temp_c = round(temp_k - 273.15, 2)
                    points.append({"lat": lat, "lng": lon, "temp_c": temp_c, "source": "openweathermap"})
                except Exception:
                    points.append({"lat": lat, "lng": lon, "temp_c": None, "source": "fallback"})

        return {"city": city, "points": points}
    except Exception as e:
        # On any failure return a small synthetic grid so the UI can continue
        center_lat, center_lon = default_center
        points = []
        for i in range(-half, half + 1):
            for j in range(-half, half + 1):
                lat = center_lat + (i * 0.01)
                lon = center_lon + (j * 0.01)
                temp_c = 28 + (i * 0.8) + (j * 0.5)
                points.append({"lat": lat, "lng": lon, "temp_c": round(temp_c, 2), "source": "synthetic"})

        return {"city": city, "points": points, "error": str(e)}


def fetch_weather_by_coords(lat: float, lon: float, api_key: str = None):
    """Fetch current weather using OpenWeather by latitude/longitude.

    Falls back to a small synthetic response when api_key is missing or on error.
    Returns the same shape as fetch_weather (OpenWeather JSON or synthetic/fallback).
    """
    if not api_key:
        return {
            "coord": {"lat": lat, "lon": lon},
            "main": {"temp": 298.15},
            "weather": [{"description": "Synthetic Clear"}],
            "source": "synthetic"
        }

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        data["source"] = "openweathermap"
        return data
    except Exception as e:
        return {"coord": {"lat": lat, "lon": lon}, "error": str(e), "source": "fallback"}


def reverse_geocode(lat: float, lon: float, api_key: str = None):
    """Return a simple place/city name from coordinates using OpenWeather reverse geocoding.

    Falls back to a generic name when api_key is missing or on error.
    """
    if not api_key:
        return {"name": "Unknown", "source": "synthetic"}

    try:
        url = f"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={api_key}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            return {"name": "Unknown", "source": "openweathermap"}
        return {"name": data[0].get("name") or data[0].get("local_names", {}).get("en") or "Unknown", "source": "openweathermap"}
    except Exception as e:
        return {"name": "Unknown", "error": str(e), "source": "fallback"}


def fetch_forecast(city: str, api_key: str = None):
    """Fetch 5-day/3-hour forecast from OpenWeather.
    
    Useful for determining trends (rising/falling temperature).
    """
    if not api_key:
        return None

    try:
        url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        data["source"] = "openweathermap"
        return data
    except Exception:
        return None
