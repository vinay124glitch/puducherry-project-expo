import { useState, useCallback } from "react";

export type Severity = "critical" | "high" | "moderate" | "low";

export interface Alert {
    id: number;
    type: string;
    location: string;
    severity: Severity;
    time: string;
    iconType: "mountain" | "waves" | "wind" | "activity";
}

export interface EnergyData {
    time: string;
    demand: number;
    supply: number;
    shortfall: number;
}

// Based on Report Methodology Section 7
const BASE_DAMAGE = {
    EARTHQUAKE: 85,
    FLOOD: 70,
    CYCLONE: 60,
    DEFAULT: 50
};

const INFRASTRUCTURE_STRENGTH = 40; // Default factor

export const useSimulation = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [resilience, setResilience] = useState(82); // Starting healthy
    const [alerts, setAlerts] = useState<Alert[]>([
        { id: 2, type: "Flood Warning", location: "Coastal Region", severity: "high", time: "15 min ago", iconType: "waves" },
        { id: 3, type: "Cyclone Alert", location: "Eastern Sector", severity: "moderate", time: "32 min ago", iconType: "wind" },
    ]);

    const [energyData, setEnergyData] = useState<EnergyData[]>([
        { time: "00:00", demand: 4200, supply: 4800, shortfall: 0 },
        { time: "04:00", demand: 3800, supply: 4600, shortfall: 0 },
        { time: "08:00", demand: 5200, supply: 4900, shortfall: 300 },
        { time: "12:00", demand: 6800, supply: 5100, shortfall: 1700 },
        { time: "14:00", demand: 7200, supply: 7500, shortfall: 0 }, // Baseline healthy peak
        { time: "16:00", demand: 6500, supply: 6800, shortfall: 0 },
        { time: "18:00", demand: 5800, supply: 6000, shortfall: 0 },
        { time: "20:00", demand: 5000, supply: 5200, shortfall: 0 },
        { time: "22:00", demand: 4400, supply: 4700, shortfall: 0 },
    ]);

    const triggerDisaster = useCallback((disasterType: 'EARTHQUAKE' | 'FLOOD' | 'CYCLONE', intensity: number) => {
        setIsSimulating(true);

        // Step 2: Impact Simulation Calculation (Dynamic based on Intensity)
        let dynamicBaseDamage = BASE_DAMAGE[disasterType];

        // Adjust base damage based on intensity metrics
        if (disasterType === 'EARTHQUAKE') {
            // Scale: Magnitude 5.0 to 9.5 -> 50 to 95 base damage
            dynamicBaseDamage = Math.min((intensity * 10), 100);
        } else if (disasterType === 'FLOOD') {
            // Scale: Rainfall 50mm to 500mm -> 10 to 100 base damage
            dynamicBaseDamage = Math.min((intensity / 5), 100);
        } else if (disasterType === 'CYCLONE') {
            // Scale: Wind Speed 60km/h to 300km/h -> 20 to 100 base damage
            dynamicBaseDamage = Math.min((intensity / 3), 100);
        }

        const damage = Math.max(dynamicBaseDamage - (INFRASTRUCTURE_STRENGTH * 0.5), 10);

        // Step 4: Resilience Score Calculation
        const newResilience = Math.max(0, 100 - damage);
        setResilience(Math.round(newResilience));

        // Update alerts with specific metric
        const unit = disasterType === 'EARTHQUAKE' ? 'Mag' : (disasterType === 'FLOOD' ? 'mm' : 'km/h');
        const newAlert: Alert = {
            id: Date.now(),
            type: `${disasterType} Detected (${intensity}${unit})`,
            location: "Active Simulation Zone",
            severity: damage > 60 ? "critical" : (damage > 40 ? "high" : "moderate"),
            time: "Just now",
            iconType: disasterType === 'EARTHQUAKE' ? 'mountain' : (disasterType === 'FLOOD' ? 'waves' : 'wind'),
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);

        // Impact energy supply based on disaster severity
        setEnergyData(prev => prev.map(d => {
            // Logic: Supply drops by a factor of damage percentage
            const destructionFactor = damage / 100;
            const supplyLoss = d.supply * destructionFactor;
            const newSupply = Math.max(d.supply - supplyLoss, 1500);

            return {
                ...d,
                supply: Math.round(newSupply),
                shortfall: Math.max(d.demand - Math.round(newSupply), 0)
            };
        }));

        setTimeout(() => {
            setIsSimulating(false);
        }, 5000);
    }, []);

    const restoreGrid = useCallback(() => {
        setResilience(82);
        setEnergyData([
            { time: "00:00", demand: 4200, supply: 4800, shortfall: 0 },
            { time: "04:00", demand: 3800, supply: 4600, shortfall: 0 },
            { id: "08:00", demand: 5200, supply: 4900, shortfall: 300 } as any,
            { time: "08:00", demand: 5200, supply: 4900, shortfall: 300 },
            { time: "12:00", demand: 6800, supply: 5100, shortfall: 1700 }, // Fixed shortfall in baseline
            { time: "14:00", demand: 7200, supply: 7500, shortfall: 0 },
            { time: "16:00", demand: 6500, supply: 6800, shortfall: 0 },
            { time: "18:00", demand: 5800, supply: 6000, shortfall: 0 },
            { time: "20:00", demand: 5000, supply: 5200, shortfall: 0 },
            { time: "22:00", demand: 4400, supply: 4700, shortfall: 0 },
        ].filter((v, i, a) => (v as any).time !== undefined)); // Cleanup dual entry
        setAlerts(prev => prev.filter(a => a.time !== "Just now"));
    }, []);

    return {
        isSimulating,
        resilience,
        alerts,
        energyData,
        triggerDisaster,
        restoreGrid
    };
};
