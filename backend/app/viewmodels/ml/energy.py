import random
from datetime import datetime, timedelta

def run_energy_model(city: str = "Mumbai"):
    # Simulate dynamic energy demand
    peak_demand = round(random.uniform(2.0, 3.5), 2) # MW
    trend_val = random.randint(-15, 20)
    trend = f"{'+' if trend_val > 0 else ''}{trend_val}% from yesterday"
    
    next_peak_time = (datetime.now() + timedelta(hours=random.randint(1, 6))).strftime("%H:%M")
    
    return {
        "city": city,
        "forecast": {
            "peak_demand": peak_demand,  # MW
            "trend": trend,
            "next_peak": next_peak_time
        }
    }
