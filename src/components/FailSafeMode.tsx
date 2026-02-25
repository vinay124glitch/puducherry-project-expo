import React, { useState } from "react";
import { ShieldAlert, Terminal, Lock, Unlock, AlertTriangle } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

const FailSafeMode = () => {
    const [isLocked, setIsLocked] = useState(true);
    const [overrideActive, setOverrideActive] = useState(false);
    const { restoreGrid } = useSimulation();

    const handleOverride = () => {
        if (isLocked) return;
        setOverrideActive(!overrideActive);
        if (!overrideActive) {
            // Emergency reset when failsafe engaged
            restoreGrid();
        }
    };

    return (
        <div className={`rounded-xl border transition-all duration-500 ${overrideActive ? 'border-red-500 bg-red-500/10' : 'border-border bg-secondary/40'} backdrop-blur-xl p-6 shadow-2xl overflow-hidden relative`}>
            {overrideActive && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <ShieldAlert className={`w-5 h-5 ${overrideActive ? 'text-red-500 animate-bounce' : 'text-muted-foreground'}`} />
                        Fail-Safe Protocol (MOP)
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Autonomous Lockdown & Manual Override
                    </p>
                </div>
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className={`p-2 rounded-lg transition-all ${isLocked ? 'bg-secondary text-muted-foreground' : 'bg-green-500/20 text-green-600 border border-green-500/30'}`}
                >
                    {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${overrideActive ? 'bg-red-500 text-white border-red-400' : 'bg-secondary text-muted-foreground border-border'}`}>
                        <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-foreground">MANUAL SYSTEM OVERRIDE</div>
                        <p className="text-[9px] text-muted-foreground max-w-[200px]">
                            Engage to bypass AI resource distribution and manually control substation relays.
                        </p>
                    </div>
                    <div className="ml-auto">
                        <button
                            disabled={isLocked}
                            onClick={handleOverride}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-30 ${overrideActive ? 'bg-red-600' : 'bg-secondary'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${overrideActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                        label="FORCED DISCONNECT"
                        active={overrideActive}
                        color="hover:bg-red-500 hover:text-white"
                        icon={<AlertTriangle className="w-3 h-3" />}
                    />
                    <ActionButton
                        label="ISOLATE CORE"
                        active={overrideActive}
                        color="hover:bg-orange-500 hover:text-white"
                        icon={<ShieldAlert className="w-3 h-3" />}
                    />
                </div>
            </div>

            {overrideActive && (
                <div className="mt-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg animate-in zoom-in-95">
                    <div className="text-[10px] font-bold text-red-600 mb-1 uppercase tracking-tighter flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> CRITICAL: MANUAL MODE ACTIVE
                    </div>
                    <p className="text-[9px] text-red-900 dark:text-red-100 leading-tight">
                        AI Load Balancing is <strong>DISABLED</strong>. Grid stability is now dependent on manual operator inputs.
                    </p>
                </div>
            )}
        </div>
    );
};

const ActionButton = ({ label, active, color, icon }: { label: string, active: boolean, color: string, icon: React.ReactNode }) => (
    <button
        disabled={!active}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[9px] font-bold transition-all border ${active ? `text-foreground border-border ${color}` : 'text-muted-foreground border-border/50 cursor-not-allowed'}`}
    >
        {icon}
        {label}
    </button>
);

export default FailSafeMode;
