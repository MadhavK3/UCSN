# Indradhanu — Urban Climate Resilience Dashboard

## 🎥 Video Demonstration  
[Watch Here](https://youtu.be/6tekVWPuZZ4?si=EDNUr8Edz0fPgNkP)
---

## 📋 Overview

**Indradhanu** is a comprehensive full-stack platform designed to enhance urban climate resilience. It integrates a high-fidelity **Digital Twin** with an **AI/ML-powered backend** to simulate, monitor, and predict complex climate challenges.

City planners and administrators can visualize real-time data, forecast heat islands, air quality, flood risks, and energy patterns — all through an interactive 3D dashboard.

---

## ✨ Key Features

### 🏙️ 3D Digital Twin  
Interactive Three.js-based replica of the city with:
- Building footprints & heights  
- Road networks  
- Environmental data overlays  
- Real-time activity flows  

### 🤖 AI/ML Hub  
- **Predictive Intelligence** for AQI, heatwaves, and flood risks  
- **Anomaly Detection** for faulty or irregular sensor data  
- **Carbon Tracker** for real-time carbon footprint analytics  

### 🌡️ Simulation Engine  
- Urban Heat Island simulations  
- Traffic emissions & pollutant dispersion  
- Coastal shielding & flood modeling  
- Deterministic and AI-enhanced scenario generation  

### 📢 Smart Alerting  
Automated alerts via SMS and push notifications when environmental thresholds are crossed.

### 📊 Interactive Analytics  
Heatmaps, time-series plots, city overlays, and detailed drill-down analytics.

### 🌍 Real-time Data Integration  
Includes OpenWeatherMap, satellite data ingestion, and sensor-based updates.

---

## 🛠️ Tech Stack

### **Frontend**
- React (Vite)  
- Tailwind CSS  
- Three.js / @react-three/fiber  
- Recharts  
- Leaflet (React-Leaflet)  
- Zustand (State Management)

### **Backend**
- FastAPI  
- MongoDB  
- Scikit-learn  
- Google Gemini Agents  
- OpenWeatherMap API  
- Twilio SMS Integration  

---

## 🚀 Quick Start (Windows)

### 1. Prerequisites  
Install on your system:  
- Python 3.8+  
- Node.js (LTS)  
- MongoDB (local service or cloud URI)

---

### 2. Configuration  
Create a `.env` file inside:  
`madhavk3/ucsn/UCSN-a829c5d2ba073a60ebc1886618291cb7bc8c8e35/`

Add:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
MONGO_URI=mongodb://localhost:27017/
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone_number
````

---

### 3. Installation

Run the automated setup script:

```bash
setup.bat
```

This creates a virtual environment and installs backend + frontend dependencies.

---

### 4. Start Application

Launch both backend and frontend simultaneously:

```bash
start.bat
```

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Project Structure

```
indradhanu/
├── backend/
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── viewmodels/       # Business logic & simulation engines
│   │   │   ├── ai/           # AI agents & recommendations
│   │   │   ├── digital_twin/ # 3D models & scenario runners
│   │   │   └── ml/           # ML models for forecasting & anomalies
│   │   └── views/            # API routes
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Charts, maps, 3D scenes
│   │   ├── pages/            # Dashboard, simulation pages
│   │   └── state/            # Zustand global state
│   └── package.json          # Frontend dependencies
├── .env                      # Environment variables
├── setup.bat                 # One-click setup
└── start.bat                 # One-click application runner
```

---

## 🔧 Troubleshooting

### Missing Modules

Run `setup.bat` again to reinstall dependencies.

### Port Conflicts

Ensure ports **8000** (Backend) and **5173** (Frontend) are free.

### MongoDB Errors

Confirm your MongoDB service is running or your cloud URI is correct.

### Environment Variables

Verify your `.env` file exists and contains valid keys.

---

## 📜 License

Separate license files are provided for backend and frontend:

* `licenses-backend.json`
* `licenses-frontend.json`

Please refer to them for detailed terms.

---

```

---


