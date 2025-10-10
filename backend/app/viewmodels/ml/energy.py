def run_energy_model(city: str = "Mumbai"):
    # Dummy: return energy demand forecast
    return {
        "city": city,
        "forecast": {
            "peak_demand": 2.4,  # MW
            "trend": "+12% from yesterday",
            "next_peak": "2025-08-31T14:00:00Z"
        }
    }
