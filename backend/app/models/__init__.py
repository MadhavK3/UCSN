from pydantic import BaseModel
from typing import List, Optional

class Weather(BaseModel):
    city: str
    temp: float
    description: str
    timestamp: str

class Hotspot(BaseModel):
    zone: str
    temp: float
    type: str

class FloodAlert(BaseModel):
    zone: str
    risk: str
    rainfall: Optional[float]
    tide: Optional[float]
    prediction: Optional[str]

class EnergyForecast(BaseModel):
    city: str
    peak_demand: float
    trend: str
    next_peak: str

class GreenSimulationResult(BaseModel):
    zone: str
    original_temp: float
    simulated_temp: float
    co2_reduction: float
    interventions: dict
