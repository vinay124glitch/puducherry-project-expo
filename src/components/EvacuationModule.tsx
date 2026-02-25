import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { MoveUpRight, Home, Map, Users, Navigation, AlertTriangle } from "lucide-react";

const EvacuationModule = () => {
    const { infrastructure, alerts, resilience } = useSimulation();

    // Filter shelters from infrastructure
    const shelters = infrastructure.filter(i => i.type === 'shelter');
    const activeDisaster = alerts.find(a => a.time === "Just now");

    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-emerald-500" />
                        Evacuation & Shelters
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Logistical Safe-Zone Routing
                    </p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold">
                    {shelters.length} ACTIVE SHELTERS
                </div>
            </div>

            {activeDisaster ? (
                <div className="mb-6 p-4 bg-critical/10 border border-critical/20 rounded-lg animate-pulse">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-critical shrink-0" />
                        <div>
                            <div className="text-sm font-bold text-critical uppercase tracking-tighter">Immediate Evacuation Recommended</div>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                                A {activeDisaster.type} has been detected. High-risk zones (0-30 resilience) must vacate to nearest P5 shelters.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-success/5 border border-success/10 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Home className="w-5 h-5 text-success shrink-0" />
                        <div>
                            <div className="text-sm font-bold text-success uppercase tracking-tighter">Status: Standby</div>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                                All designated safe-zones are currently available and stocked. No active evacuation orders.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="text-[10px] text-muted-foreground uppercase font-mono mb-2 flex items-center gap-2">
                    <Map className="w-3 h-3" /> Designated Safe Zones
                </div>

                {shelters.map((shelter) => (
                    <div key={shelter.id} className="p-3 bg-secondary/50 border border-border rounded-lg group hover:bg-secondary transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${shelter.status === 'online' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                    <Home className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-foreground uppercase tracking-tight">{shelter.name}</div>
                                    <div className="text-[9px] text-muted-foreground font-mono">CAPACITY: 850 / 2,000</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-bold text-success">OPEN</div>
                                <div className="text-[8px] text-muted-foreground">2.4 KM AWAY</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border/50">
                                <div className="h-full bg-success w-[42%]" />
                            </div>
                            <button className="text-[8px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 uppercase transition-colors">
                                Route <MoveUpRight className="w-2 h-2" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                    <Users className="w-5 h-5 text-primary mb-1" />
                    <div className="text-lg font-black text-foreground">4,120</div>
                    <div className="text-[7px] text-muted-foreground uppercase font-mono">Current Occupancy</div>
                </div>
                <div className="flex flex-col items-center">
                    <Map className="w-5 h-5 text-purple-500 mb-1" />
                    <div className="text-lg font-black text-foreground">12.5k</div>
                    <div className="text-[7px] text-muted-foreground uppercase font-mono">Total Capacity</div>
                </div>
            </div>
        </div>
    );
};

export default EvacuationModule;
