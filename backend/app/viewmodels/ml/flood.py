import random

def run_flood_model(rainfall_data=None, tide_data=None):
    # Simulate dynamic risk based on random factors for demo purposes
    rainfall = random.randint(50, 200)
    tide = round(random.uniform(0.5, 2.5), 2)
    
    risk = "Low"
    if rainfall > 150 or tide > 2.0:
        risk = "High"
    elif rainfall > 100 or tide > 1.5:
        risk = "Medium"
        
    return {
        "zone": "Mumbai Coastal",
        "risk": risk,
        "details": {
            "rainfall": rainfall,  # mm
            "tide": tide,      # meters
            "prediction": "Possible surge in next 24h" if risk != "Low" else "Conditions stable"
        }
    }
