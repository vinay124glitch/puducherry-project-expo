import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Truck, Users, Package, Activity, Inbox } from "lucide-react";

const ResourceManagement = () => {
    const { resilience, alerts } = useSimulation();

    // Calculate affected population based on alerts and resilience
    // Base population for the region ~1.2M
    const totalPop = 1200000;

    // Affected pop increases as resilience decreases
    // If resilience is 82 (baseline), affected is 0.
    // If resilience is 0, affected is 20% of totalPop
    const affectedFactor = Math.max(0, (82 - resilience) / 82);
    const affectedPop = Math.round(totalPop * affectedFactor * 0.25);

    // Formulas from USER request:
    // Affected people -> Required food packets (2 per person)
    // Injured -> Required ambulances (1 per 500 affected)

    const foodPackets = affectedPop * 2;
    const ambulances = Math.ceil(affectedPop / 500);
    const medicalKits = Math.ceil(affectedPop / 100);
    const rescueTeams = Math.ceil(affectedPop / 2000);

    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-primary" />
                        Relief Resource Logistics
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Automated Supply Chain Requirement Model
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">Total Population Coverage</div>
                    <div className="text-sm font-bold text-foreground font-mono">1,240,000 +</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/40 border border-border rounded-lg p-4 flex flex-col items-center justify-center">
                    <Users className="w-6 h-6 text-critical mb-2" />
                    <div className="text-2xl font-bold text-foreground font-mono">{affectedPop.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Estimated Affected</div>
                </div>
                <div className="bg-secondary/40 border border-border rounded-lg p-4 flex flex-col items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-500 mb-2" />
                    <div className="text-2xl font-bold text-foreground font-mono">{Math.round(affectedPop * 0.1).toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Likely Injured</div>
                </div>
            </div>

            <div className="space-y-4">
                <ResourceItem
                    icon={<Package className="w-4 h-4 text-emerald-500" />}
                    label="Food Packets Required"
                    value={foodPackets.toLocaleString()}
                    status="Allocating"
                    progress={75}
                />
                <ResourceItem
                    icon={<Truck className="w-4 h-4 text-blue-500" />}
                    label="Ambulances Deployed"
                    value={ambulances.toString()}
                    status="In Transit"
                    progress={45}
                />
                <ResourceItem
                    icon={<Activity className="w-4 h-4 text-purple-500" />}
                    label="Medical Kits Dispatched"
                    value={medicalKits.toLocaleString()}
                    status="Ready"
                    progress={100}
                />
                <ResourceItem
                    icon={<Users className="w-4 h-4 text-yellow-500" />}
                    label="Rescue Teams (NDRF)"
                    value={rescueTeams.toString()}
                    status="Mobilizing"
                    progress={20}
                />
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest shadow-lg shadow-primary/10">
                    REQUEST EMERGENCY MOBILIZATION
                </button>
            </div>
        </div>
    );
};

const ResourceItem = ({ icon, label, value, status, progress }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    status: string,
    progress: number
}) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[11px] font-bold text-foreground uppercase tracking-tight">{label}</span>
            </div>
            <div className="text-right">
                <div className="text-xs font-bold text-foreground font-mono">{value}</div>
                <div className="text-[9px] text-muted-foreground font-mono uppercase">{status}</div>
            </div>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

export default ResourceManagement;
