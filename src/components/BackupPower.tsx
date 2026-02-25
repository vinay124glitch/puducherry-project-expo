import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Zap, Battery, Droplet, Clock, Power, ShieldCheck } from "lucide-react";

const BackupPower = () => {
    const { infrastructure, energyData, resilience } = useSimulation();

    // Power stations and hospital backups
    const criticalUnits = infrastructure.filter(i => i.type === 'power' || i.type === 'hospital');
    const totalFuelHours = criticalUnits.reduce((acc, curr) => acc + (curr.fuelHours || 0), 0);
    const avgFuel = totalFuelHours / (criticalUnits.length || 1);

    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Battery className="w-5 h-5 text-emerald-500" />
                        Backup Power Planning
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Generator & Fuel Reserve Intelligence
                    </p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    SECURE
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-secondary border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Fuel Reserve</span>
                    </div>
                    <div className="text-2xl font-black text-foreground">18.4k <span className="text-[10px] text-muted-foreground font-normal">LTR</span></div>
                    <div className="mt-2 h-1 w-full bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[78%]" />
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Est. Duration</span>
                    </div>
                    <div className="text-2xl font-black text-foreground">{avgFuel.toFixed(1)} <span className="text-[10px] text-muted-foreground font-normal">HRS</span></div>
                    <div className="text-[8px] text-muted-foreground/60 mt-2 uppercase font-mono italic">Across 7 Main Substations</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-[10px] text-muted-foreground uppercase font-mono mb-2 flex items-center gap-2">
                    <Power className="w-3 h-3" /> Critical Unit Energy Status
                </div>

                {criticalUnits.map((unit) => (
                    <div key={unit.id} className="p-3 bg-secondary/50 border border-border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${unit.status === 'online' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                    {unit.type === 'power' ? <Zap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-foreground uppercase tracking-tight">{unit.name}</div>
                                    <div className="text-[8px] text-muted-foreground font-mono">PRIORITY {unit.priority} • {unit.type.toUpperCase()}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-[9px] font-bold px-2 py-0.5 rounded border ${unit.status === 'online' ? 'text-success border-success/30' : 'text-destructive border-destructive/30'}`}>
                                    {unit.status.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                <Battery className="w-3 h-3" /> {unit.fuelHours || 0}h Battery
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-muted-foreground/60">
                                <Droplet className="w-3 h-3" /> Diesel Gen Enabled
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                <button className="w-full bg-success/10 hover:bg-success/20 text-success border border-success/30 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">
                    SIMULATE BLACKOUT RESPONSE
                </button>
            </div>
        </div>
    );
};

export default BackupPower;
