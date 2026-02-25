import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { ShieldAlert, Zap, Radiation, Crosshair } from "lucide-react";

const GridMap = () => {
    const { resilience, isSimulating } = useSimulation();

    // Simulated sectors in Puducherry
    const sectors = [
        { id: "S1", name: "White Town (Hospitals)", x: 70, y: 50, critical: true },
        { id: "S2", name: "Heritage Town", x: 40, y: 40, critical: false },
        { id: "S3", name: "Indira Nagar", x: 30, y: 70, critical: false },
        { id: "S4", name: "Muthialpet", x: 50, y: 20, critical: false },
        { id: "S5", name: "Villianur Grid", x: 20, y: 30, critical: true },
        { id: "S6", name: "Lawspet Sector", x: 80, y: 30, critical: false },
    ];

    const getStatusColor = (critical: boolean) => {
        if (resilience < 40) return critical ? "stroke-critical fill-critical/20" : "stroke-warning fill-warning/20";
        if (resilience < 70) return "stroke-warning fill-warning/10";
        return "stroke-primary fill-primary/10";
    };

    return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-primary animate-pulse" />
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider">Sector Grid Surveillance</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" /> STABLE
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-warning" /> STRESSED
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-critical" /> OUTAGE
                    </span>
                </div>
            </div>

            <div className="relative aspect-[4/3] w-full bg-slate-950/50 rounded-lg border border-border/50 overflow-hidden group">
                {/* Radar Grids */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-primary/30" />
                    ))}
                </div>

                {/* Dynamic Scan Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-primary/50 to-transparent animate-scan-line pointer-events-none" />

                {/* Puducherry Visual Map (Simplified Polygon) */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full p-4">
                    {/* Main Hub Connections */}
                    <path
                        d="M20,30 L70,50 M50,20 L70,50 M30,70 L70,50 M40,40 L20,30"
                        className={`fill-none stroke-[0.5] transition-all duration-1000 ${isSimulating ? 'stroke-critical animate-pulse' : 'stroke-primary/30'}`}
                    />

                    {/* Sector Points */}
                    {sectors.map((sector) => (
                        <g key={sector.id} className="cursor-help group/sector">
                            <circle
                                cx={sector.x}
                                cy={sector.y}
                                r={sector.critical ? "4" : "3"}
                                className={`transition-all duration-1000 ${getStatusColor(sector.critical)} ${isSimulating && sector.critical ? 'animate-ping' : ''}`}
                            />
                            <circle
                                cx={sector.x}
                                cy={sector.y}
                                r="1"
                                className={`fill-foreground transition-all duration-1000 ${resilience < 40 ? 'fill-critical' : 'fill-primary'}`}
                            />
                            {/* Tooltip Simulation */}
                            <foreignObject x={sector.x + 4} y={sector.y - 10} width="60" height="20" className="overflow-visible opacity-0 group-hover/sector:opacity-100 transition-opacity">
                                <div className="bg-background/90 border border-border rounded px-2 py-1 text-[8px] font-mono whitespace-nowrap backdrop-blur-sm shadow-xl">
                                    {sector.name}
                                    <div className="flex gap-1 items-center">
                                        <Zap className="h-2 w-2" /> {resilience}% Load
                                    </div>
                                </div>
                            </foreignObject>
                        </g>
                    ))}

                    {/* Crisis Overlay */}
                    {isSimulating && (
                        <g className="animate-pulse">
                            <circle cx="50" cy="50" r="15" className="fill-critical/5 stroke-critical/20 stroke-[0.5]" />
                            <Radiation className="h-6 w-6 text-critical x-[40] y-[40]" />
                        </g>
                    )}
                </svg>

                {/* Status Overlay */}
                <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-2 py-1 rounded border border-border text-[8px] font-mono">
                        <div className={`h-1.5 w-1.5 rounded-full ${resilience < 40 ? 'bg-critical animate-ping' : 'bg-primary'}`} />
                        LAT: 11.9416° N / LON: 79.8083° E
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridMap;
