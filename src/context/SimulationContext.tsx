import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";

export type Severity = "critical" | "high" | "moderate" | "low";

export interface Alert {
    id: number;
    type: string;
    location: string;
    severity: Severity;
    time: string;
    iconType: "mountain" | "waves" | "wind" | "activity";
    coordinates?: [number, number]; // [lng, lat] for Mapbox
    radius?: number; // km
    intensity?: number;
}

export interface EnergyData {
    time: string;
    demand: number;
    supply: number;
    shortfall: number;
}

export interface Infrastructure {
    id: string;
    name: string;
    type: 'hospital' | 'power' | 'shelter' | 'water' | 'emergency';
    coordinates: [number, number];
    priority: number; // 1-6
    status: 'online' | 'warning' | 'offline';
    lastBackup?: string;
    fuelHours?: number;
}

const BASE_DAMAGE = {
    EARTHQUAKE: 85,
    FLOOD: 70,
    CYCLONE: 60,
    DEFAULT: 50
};

const INFRASTRUCTURE_STRENGTH = 40;

const PUDUCHERRY_COORDS: [number, number] = [79.8083, 11.9416];

interface SimulationContextType {
    isSimulating: boolean;
    isMonitoring: boolean;
    setIsMonitoring: (value: boolean) => void;
    resilience: number;
    alerts: Alert[];
    energyData: EnergyData[];
    infrastructure: Infrastructure[];
    triggerDisaster: (disasterType: 'EARTHQUAKE' | 'FLOOD' | 'CYCLONE', intensity: number, coordinates?: [number, number]) => void;
    syncWithLiveAPIs: () => Promise<void>;
    restoreGrid: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [energyData, setEnergyData] = useState<EnergyData[]>([
        { time: "00:00", demand: 4200, supply: 4800, shortfall: 0 },
        { time: "04:00", demand: 3800, supply: 4600, shortfall: 0 },
        { time: "08:00", demand: 5200, supply: 4900, shortfall: 300 },
        { time: "12:00", demand: 6800, supply: 5100, shortfall: 1700 },
        { time: "14:00", demand: 7200, supply: 7500, shortfall: 0 },
        { time: "16:00", demand: 6500, supply: 6800, shortfall: 0 },
        { time: "18:00", demand: 5800, supply: 6000, shortfall: 0 },
        { time: "20:00", demand: 5000, supply: 5200, shortfall: 0 },
        { time: "22:00", demand: 4400, supply: 4700, shortfall: 0 },
    ]);

    const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([
        { id: '1', name: 'JIPMER Hospital', type: 'hospital', coordinates: [79.81, 11.948], priority: 1, status: 'online', fuelHours: 24 },
        { id: '2', name: 'IGMCRI', type: 'hospital', coordinates: [79.79, 11.93], priority: 1, status: 'online', fuelHours: 12 },
        { id: '3', name: 'Main Power Station', type: 'power', coordinates: [79.82, 11.92], priority: 2, status: 'online' },
        { id: '4', name: 'Emergency Control HQ', type: 'emergency', coordinates: [79.808, 11.9416], priority: 2, status: 'online' },
        { id: '5', name: 'Water Treatment Plant', type: 'water', coordinates: [79.78, 11.96], priority: 3, status: 'online' },
        { id: '6', name: 'Community Hall Shelter', type: 'shelter', coordinates: [79.83, 11.95], priority: 5, status: 'online' },
        { id: '7', name: 'Puducherry University Shelter', type: 'shelter', coordinates: [79.84, 12.01], priority: 5, status: 'online' },
    ]);

    const [resilience, setResilience] = useState(82);

    // Background Jitter & Load Degradation Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setResilience(prev => {
                const currentShortfall = energyData[4].shortfall;
                const currentDemand = energyData[4].demand;
                let jitter = (Math.random() - 0.5) * 0.3;
                let degradation = 0;
                if (currentShortfall > 0) {
                    degradation = (currentShortfall / currentDemand) * 0.4;
                }
                let recovery = 0;
                if (currentShortfall === 0 && prev < 82) {
                    recovery = 0.05;
                }
                const next = prev - degradation + jitter + recovery;
                return Math.max(5, Math.min(100, Math.round(next * 10) / 10));
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [energyData]);

    const lastEventId = useRef<string | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([
        { id: 2, type: "Flood Warning", location: "Coastal Region", severity: "high", time: "15 min ago", iconType: "waves", coordinates: [79.83, 11.93], radius: 15 },
        { id: 3, type: "Cyclone Alert", location: "Eastern Sector", severity: "moderate", time: "32 min ago", iconType: "wind", coordinates: [79.85, 12.05], radius: 45 },
    ]);

    const triggerDisaster = useCallback((disasterType: 'EARTHQUAKE' | 'FLOOD' | 'CYCLONE', intensity: number, coords?: [number, number]) => {
        setIsSimulating(true);

        const epicenter = coords || PUDUCHERRY_COORDS;

        // Calculate Radius based on User Request Logic
        // Earthquake Radius = Magnitude × 20 km
        // Cyclone Radius = WindSpeed × 1.5 km
        // Flood Radius = Rainfall × 0.8 km
        let radius = 0;
        if (disasterType === 'EARTHQUAKE') radius = intensity * 20;
        else if (disasterType === 'CYCLONE') radius = intensity * 1.5;
        else if (disasterType === 'FLOOD') radius = intensity * 0.8;

        // 1. Calculate Damage Impact
        let dynamicBaseDamage = BASE_DAMAGE[disasterType];
        if (disasterType === 'EARTHQUAKE') {
            dynamicBaseDamage = Math.min((intensity * 10), 100);
        } else if (disasterType === 'FLOOD') {
            dynamicBaseDamage = Math.min((intensity / 5), 100);
        } else if (disasterType === 'CYCLONE') {
            dynamicBaseDamage = Math.min((intensity / 3), 100);
        }

        const stochasticFactor = 0.85 + (Math.random() * 0.3);
        const damage = Math.max((dynamicBaseDamage * stochasticFactor) - (INFRASTRUCTURE_STRENGTH * 0.5), 10);

        // 2. Compute Resilience Score
        const newResilience = Math.max(0, 100 - damage);
        setResilience(Math.round(newResilience));

        // 3. Update Infrastructure Status based on proximity to epicenter
        setInfrastructure(prev => prev.map(infra => {
            // Simplified distance check (should use haversine for real)
            const dist = Math.sqrt(Math.pow(infra.coordinates[0] - epicenter[0], 2) + Math.pow(infra.coordinates[1] - epicenter[1], 2)) * 111; // 1 deg ~ 111km
            if (dist < radius) {
                return { ...infra, status: damage > 50 ? 'offline' : 'warning' };
            }
            return infra;
        }));

        // 4. Estimate Energy Demand & Potential Shortages
        setEnergyData(prev => prev.map(d => {
            const emergencyDemandSpike = 1 + (damage / 200);
            const estimatedDemand = Math.round(d.demand * emergencyDemandSpike);
            const destructionFactor = damage / 100;
            const supplyLoss = d.supply * destructionFactor;
            const remainingSupply = Math.max(d.supply - supplyLoss, 1000);

            return {
                ...d,
                demand: estimatedDemand,
                supply: Math.round(remainingSupply),
                shortfall: Math.max(estimatedDemand - Math.round(remainingSupply), 0)
            };
        }));

        const unit = disasterType === 'EARTHQUAKE' ? 'Mag' : (disasterType === 'FLOOD' ? 'mm' : 'km/h');
        const newAlert: Alert = {
            id: Date.now(),
            type: `${disasterType} Detected (${intensity}${unit})`,
            location: epicenter === PUDUCHERRY_COORDS ? "Puducherry Sector Alpha" : "Detected Region",
            severity: damage > 60 ? "critical" : (damage > 40 ? "high" : "moderate"),
            time: "Just now",
            iconType: disasterType === 'EARTHQUAKE' ? 'mountain' : (disasterType === 'FLOOD' ? 'waves' : 'wind'),
            coordinates: epicenter,
            radius: radius,
            intensity: intensity
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);

        setTimeout(() => {
            setIsSimulating(false);
        }, 5000);
    }, []);

    const lastCycloneId = useRef<string | null>(null);

    const syncWithLiveAPIs = useCallback(async (isAuto = false) => {
        if (!isAuto) setIsSimulating(true);
        try {
            const eqResponse = await fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=5");
            const eqData = await eqResponse.json();
            if (eqData.features && eqData.features.length > 0) {
                const latest = eqData.features[0];
                if (latest.id !== lastEventId.current) {
                    lastEventId.current = latest.id;
                    const props = latest.properties;
                    const coords = latest.geometry.coordinates; // [lng, lat, depth]
                    triggerDisaster('EARTHQUAKE', props.mag, [coords[0], coords[1]]);
                }
            }

            const cyResponse = await fetch("https://www.gdacs.org/xml/rss.xml");
            const cyText = await cyResponse.text();
            if (cyText.includes("<title>Tropical Cyclone")) {
                const match = cyText.match(/<title>(Tropical Cyclone [^<]+)<\/title>/);
                const currentCyId = match ? match[1] : null;
                if (currentCyId && currentCyId !== lastCycloneId.current) {
                    lastCycloneId.current = currentCyId;
                    triggerDisaster('CYCLONE', 180 + (Math.random() * 50));
                }
            }

            const flResponse = await fetch("https://api.open-meteo.com/v1/forecast?latitude=11.94&longitude=79.81&current_weather=true&hourly=precipitation");
            const flData = await flResponse.json();
            if (flData.hourly && flData.hourly.precipitation) {
                const rain = flData.hourly.precipitation[0];
                if (rain > 5.0) {
                    triggerDisaster('FLOOD', rain * (20 + Math.random() * 10));
                }
            }

        } catch (error) {
            console.error("Multi-API Sync Error:", error);
        } finally {
            if (!isAuto) setTimeout(() => setIsSimulating(false), 5000);
        }
    }, [triggerDisaster]);

    useEffect(() => {
        if (!isMonitoring) return;
        syncWithLiveAPIs(true);
        const interval = setInterval(() => {
            syncWithLiveAPIs(true);
        }, 15000);
        return () => clearInterval(interval);
    }, [isMonitoring, syncWithLiveAPIs]);

    const restoreGrid = useCallback(() => {
        setResilience(82);
        setInfrastructure(prev => prev.map(infra => ({ ...infra, status: 'online' })));
        setEnergyData([
            { time: "00:00", demand: 4200, supply: 4800, shortfall: 0 },
            { time: "04:00", demand: 3800, supply: 4600, shortfall: 0 },
            { time: "08:00", demand: 5200, supply: 4900, shortfall: 300 },
            { time: "12:00", demand: 6800, supply: 5100, shortfall: 1700 },
            { time: "14:00", demand: 7200, supply: 7500, shortfall: 0 },
            { time: "16:00", demand: 6500, supply: 6800, shortfall: 0 },
            { time: "18:00", demand: 5800, supply: 6000, shortfall: 0 },
            { time: "20:00", demand: 5000, supply: 5200, shortfall: 0 },
            { time: "22:00", demand: 4400, supply: 4700, shortfall: 0 },
        ]);
        setAlerts(prev => prev.filter(a => a.time !== "Just now"));
    }, []);

    return (
        <SimulationContext.Provider value={{ isSimulating, isMonitoring, setIsMonitoring, resilience, alerts, energyData, infrastructure, triggerDisaster, syncWithLiveAPIs, restoreGrid }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error("useSimulation must be used within a SimulationProvider");
    }
    return context;
};
