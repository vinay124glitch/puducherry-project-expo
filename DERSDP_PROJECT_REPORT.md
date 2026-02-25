# Disaster–Energy Resilience Simulation & Detection Platform (DERSDP)

## 1. Abstract
Disasters such as floods, earthquakes, and cyclones significantly disrupt energy infrastructure, leading to power shortages and reduced emergency response efficiency. The Disaster–Energy Resilience Simulation & Detection Platform (DERSDP) is a web-based decision-support system designed to detect disasters using real-time public APIs and simulate their impact on energy systems. The platform integrates data from sources such as USGS for earthquake detection and OpenWeather for weather-based disaster alerts. Upon detection, the system calculates damage impact, energy demand, shortage levels, and a resilience score. It provides optimized energy allocation recommendations for critical infrastructure such as hospitals and emergency services. The platform enhances disaster preparedness and supports smart city planning by enabling efficient energy management during crisis situations.

## 2. Introduction
Disasters are unpredictable events that can severely impact infrastructure, especially energy systems. During emergencies, electricity becomes a critical resource for hospitals, communication systems, rescue operations, and public safety. 

Traditional disaster management systems focus mainly on prediction or alerts. However, there is a lack of integrated platforms that combine:
- Disaster detection
- Impact simulation
- Energy demand estimation
- Resilience assessment
- Optimization recommendations

This project aims to bridge that gap by creating an intelligent disaster-energy management system.

## 3. Problem Statement
During disasters:
- Power grids fail or get damaged.
- Energy demand increases suddenly.
- Authorities lack decision-support tools.
- Critical infrastructure does not receive prioritized allocation.
- There is no unified system that combines real-time detection with energy resilience planning.

## 4. Objectives
The main objectives of this project are:
- Detect disasters using public real-time APIs.
- Simulate disaster impact on infrastructure.
- Estimate energy demand and shortage.
- Calculate a resilience score (0–100).
- Provide energy optimization recommendations.
- Display results on an interactive dashboard.

## 5. Literature Review
Existing systems include Early Warning Systems, Weather Monitoring Applications, and Energy Management Systems. However, these systems operate independently. There is limited integration between disaster detection and energy resilience modeling. Our project integrates both domains into one unified platform.

## 6. System Architecture
The system consists of:
- **Frontend**: React.js
- **Backend**: Python Flask (Conceptual/API Node)
- **Detection Module**: API Integration (USGS, OpenWeather)
- **Simulation Engine**: Logic-based impact analysis
- **Energy Optimization Module**: Priority-based allocation
- **Database**: SQLite (Record-keeping)

## 7. Methodology

### Step 1: Disaster Detection
The system fetches data from:
- **USGS**: Earthquake events
- **OpenWeather**: Storm alerts

Threshold-based logic:
- Earthquake magnitude > 5.5
- Wind speed > defined limit
- Rainfall > defined threshold

### Step 2: Impact Simulation
Damage Score Calculation:
`Damage = Base Damage − (Infrastructure Strength × 0.5)`

**Base Damage Values:**
- Earthquake: 85
- Flood: 70
- Cyclone: 60

### Step 3: Energy Demand Estimation
`Energy Demand = Population × Energy Factor`
`Energy Shortage = Energy Demand − Available Energy`

### Step 4: Resilience Score Calculation
`Resilience = 100 − Damage`
*Classification:*
- 0–40: High Risk
- 40–70: Medium Risk
- 70–100: Low Risk

### Step 5: Optimization
The system recommends:
- Prioritizing hospitals.
- Allocating emergency backup generators.
- Reducing non-critical load (Load shedding).

## 8. Technologies Used
- **Frontend**: React.js, Tailwind CSS, Recharts, Lucide Icons, Shadcn UI
- **Backend/Logic**: Python/JavaScript
- **API Integration**: REST APIs (USGS, OpenWeather)

## 9. Results
The platform successfully detects disaster events, simulates impact, calculates resilience scores, and provides actionable recommendations through an interactive dashboard.

## 10. Advantages
- No hardware required.
- Real-time detection.
- Integrated disaster + energy model.
- Scalable architecture.

## 11. Applications
- Municipal Disaster Management.
- Smart City Planning.
- Emergency Response Planning.
- Energy Department Monitoring.

## 12. Future Enhancements
- AI-based disaster probability prediction.
- GIS map integration.
- IoT sensor integration.

## 13. Conclusion
DERSDP provides an integrated solution for disaster impact assessment and energy resilience planning. By combining real-time detection with intelligent simulation, the system supports authorities in making faster, data-driven decisions during crisis situations.
