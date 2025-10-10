import os
from datetime import datetime


def fetch_satellite_data(area: str):
    """Return satellite metadata. If GEE credentials are present, real ingestion logic can be added.

    For now this returns synthetic GeoJSON-like metadata to avoid calling external services.
    """
    # If you later add GEE credentials detection, check env vars here.
    gee_key = os.getenv("GEE_SERVICE_ACCOUNT_JSON") or os.getenv("GEE_API_KEY")
    if not gee_key:
        # Synthetic response with minimal fields similar to what downstream ML expects
        timestamp = datetime.utcnow().isoformat() + "Z"
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"satellite": "Sentinel-2", "timestamp": timestamp, "source": "synthetic"},
                    "geometry": {"type": "Point", "coordinates": [73.8567, 18.5204]}  # example: Pune
                }
            ],
            "metadata": {"area": area, "generated_at": timestamp}
        }

    # Placeholder for future GEE integration
    return {"area": area, "satellite": "Sentinel-2", "source": "gee-placeholder"}
