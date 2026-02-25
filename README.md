# 🚀 DERSDP: Disaster-Energy Resilience Simulation & Detection Platform

**DERSDP** is a mission-critical Decision Support System (DSS) designed to monitor global disasters in real-time and simulate their cascading impacts on local energy infrastructure, specifically tailored for the **Puducherry Sector Alpha**.

## 🛰️ Project Overview
The platform serves as a high-fidelity "Digital Twin" for disaster management. It bridges the gap between global geological/meteorological data and local energy grid resilience, providing emergency responders with a 3D tactical command center to visualize and mitigate crises.

![Dashboard Preview](https://github.com/vinay124glitch/puducherry-project-expo/raw/main/public/preview.png)

## ✨ Key Features

### 🌎 **Real-Time Global Monitoring**
*   **Autonomous Polling Engine**: Synchronizes with **USGS (Seismic)**, **GDACS (Cyclones)**, and **Open-Meteo (Floods)** APIs every 15 seconds.
*   **Live Event Detection**: Automatically detects and plots globally occurring disasters with zero manual input.

### 🗺️ **3D Geospatial Intelligence (Mapbox GL JS)**
*   **Tactical HUD**: A high-performance Mapbox engine with 3D urban extrusions and environmental layer switching (Dark, Satellite, Streets).
*   **Dynamic Impact Radii**: Visualizes the physical reach of disasters using magnitude-scaled pulsing zones.
*   **Autonomous Fly-to**: Dramatic 3D camera transitions that instantly lock onto the epicenter of newly detected crises.

### ⚡ **Energy Resilience Analytics**
*   **Grid Impact Simulation**: Real-time calculation of "System Resilience Scores" based on disaster type and magnitude.
*   **Load Loss Modeling**: Tracks Demand vs. Supply metrics and calculates MW shortfalls during outages.
*   **Sector Priority Allocation**: Algorithmic recommendations for critical facility power distribution (Hospitals, Gov/Safety, Residential).

### 📋 **Strategic Reporting**
*   **Situation Briefings**: One-click **.txt export** of live "Situation Reports" containing technical metadata, threat logs, and strategic allocation status.
*   **Visual Status Board**: Integrated gauges, sparklines, and radar sector surveillance for at-a-glance situational awareness.

## 🛠️ Tech Stack
*   **Frontend**: React + TypeScript + Vite
*   **Styling**: Tailwind CSS + Shadcn UI (Cyber-Command Aesthetic)
*   **Mapping**: Mapbox GL JS (3D Extrusion & WebGL)
*   **Data Feeds**: USGS Earthquakes, GDACS RSS, Open-Meteo Precipitation API
*   **Icons**: Lucide React

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vinay124glitch/puducherry-project-expo.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

---
Built for the **Project Expo** - Disaster–Energy Resilience Platform.
