import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileCheck } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

const ExportButton = () => {
    const { resilience, alerts, energyData, isMonitoring } = useSimulation();

    const handleExport = () => {
        const timestamp = new Date().toLocaleString();
        const currentShortfall = energyData[4].shortfall;
        const currentDemand = energyData[4].demand;
        const currentSupply = energyData[4].supply;

        const report = `
# DERSDP SITUATION REPORT - ${timestamp}
==========================================

## 1. GRID STATUS SUMMARY
- Resilience Score: ${resilience}%
- Monitoring Mode: ${isMonitoring ? "AUTONOMOUS (Live API)" : "MANUAL"}
- System State: ${resilience < 40 ? "CRITICAL" : (resilience < 70 ? "STRESSED" : "STABLE")}

## 2. ENERGY METRICS (PUDUCHERY SECTOR)
- Total Demand: ${currentDemand} MW
- Current Supply: ${currentSupply} MW
- System Shortfall: ${currentShortfall} MW
- Supply Efficiency: ${Math.round((currentSupply / currentDemand) * 100)}%

## 3. ACTIVE THREAT LOG
${alerts.map(a => `- [${a.severity.toUpperCase()}] ${a.type} at ${a.location} (${a.time})`).join('\n')}

## 4. MISSION CRITICAL ALLOCATION
- Medical/HP: ${currentShortfall > 0 ? "PRIORITY ALPHA" : "STABLE"}
- Gov/Safety: ${currentShortfall > 0 ? "PRIORITY BETA" : "STABLE"}
- Residential: ${currentShortfall > 2000 ? "CONTROLLED LOAD SHEDDING" : "STABLE"}

## 5. TECHNICAL METADATA
- Build: DERSDP v1.0 Enterprise
- Region: Puduchery Sector Alpha
- External APIs: USGS, GDACS, Open-Meteo

------------------------------------------
End of Situation Report. Generated via DERSDP Decision Support System.
    `.trim();

        const blob = new Blob([report], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `DERSDP_Situation_Report_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8 gap-2 bg-success/5 border-success/30 text-success hover:bg-success/10 hover:text-success"
        >
            <FileCheck className="h-4 w-4" /> Export Situation Report
        </Button>
    );
};

export default ExportButton;
