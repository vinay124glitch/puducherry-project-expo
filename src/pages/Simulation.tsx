import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimulation } from "@/context/SimulationContext";
import { useAuth } from "@/context/AuthContext";
import {
    AlertTriangle, Zap, Shield, Activity, BarChart3,
    RefreshCw, Play, Pause, LogOut, User as UserIcon,
    Database, Map as MapIcon, Boxes, FileJson, Wifi, WifiOff,
    Sun, Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import MapboxDetection from "@/components/MapboxDetection";
import DisasterAlerts from "@/components/DisasterAlerts";
import EnergyChart from "@/components/EnergyChart";
import ResilienceGauge from "@/components/ResilienceGauge";
import EnergyAllocation from "@/components/EnergyAllocation";
import RiskClassification from "@/components/RiskClassification";
import PredictiveAnalytics from "@/components/PredictiveAnalytics";
import ResourceManagement from "@/components/ResourceManagement";
import ReportGenerator from "@/components/ReportGenerator";
import LoadForecasting from "@/components/LoadForecasting";
import FailSafeMode from "@/components/FailSafeMode";
import EarlyWarning from "@/components/EarlyWarning";
import EvacuationModule from "@/components/EvacuationModule";
import BackupPower from "@/components/BackupPower";

const Simulation = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const {
        isSimulating,
        isMonitoring,
        setIsMonitoring,
        resilience,
        alerts,
        energyData,
        triggerDisaster,
        syncWithLiveAPIs,
        restoreGrid
    } = useSimulation();

    const [intensity, setIntensity] = useState(5.0);
    const [activeTab, setActiveTab] = useState<'overview' | 'logistics' | 'analytics' | 'admin'>('overview');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    const canTrigger = user.role === "Admin" || user.role === "Authority";

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/30">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-display font-black text-xl tracking-tighter uppercase italic">DERSDP</h1>
                    </div>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <div className="hidden md:flex items-center gap-4">
                        <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<MapIcon className="w-4 h-4" />} label="Command Center" />
                        <NavButton active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} icon={<Boxes className="w-4 h-4" />} label="Logistics & Response" />
                        <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 className="w-4 h-4" />} label="Predictive Analytics" />
                        {canTrigger && <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<Database className="w-4 h-4" />} label="System Admin" />}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex flex-col items-end mr-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{user.name}</span>
                            <Badge variant="outline" className="text-[9px] bg-primary/10 border-primary/20 text-primary">
                                {user.role}
                            </Badge>
                        </div>
                        <span className="text-[9px] text-success font-mono flex items-center gap-1 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            AUTH SYSTEM SECURED
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>

                    <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <main className="p-6 max-w-[1600px] mx-auto space-y-8 pb-20">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-12 gap-8">
                        {/* Simulation Controls - LEFT SIDE (Col 3) */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            <ResilienceGauge score={resilience} />

                            <Card className={`border-indigo-500/20 bg-indigo-500/5 ${!canTrigger ? 'opacity-50 grayscale-[0.8] cursor-not-allowed' : ''}`}>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Play className="h-4 w-4 text-indigo-400" />
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-300">Trigger Module</CardTitle>
                                    </div>
                                    <CardDescription className="text-[10px] text-indigo-400/60 leading-tight">
                                        Authorized manual disaster injection. Requires level-3 clearance.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-mono">
                                            <span className="text-gray-400">INTENSITY</span>
                                            <span className="text-indigo-400 font-bold">{intensity.toFixed(1)} Units</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="10" step="0.1"
                                            value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            disabled={isSimulating || !canTrigger}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <TriggerButton label="Earthquake (USGS)" onClick={() => triggerDisaster('EARTHQUAKE', intensity)} disabled={isSimulating || !canTrigger} />
                                        <TriggerButton label="Flood (Open-Meteo)" onClick={() => triggerDisaster('FLOOD', intensity * 10)} disabled={isSimulating || !canTrigger} />
                                        <TriggerButton label="Cyclone (GDACS)" onClick={() => triggerDisaster('CYCLONE', intensity * 20)} disabled={isSimulating || !canTrigger} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-500/20 bg-emerald-500/5">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {isMonitoring ? <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
                                            <span className="text-[10px] font-bold uppercase text-foreground">Live Monitoring</span>
                                        </div>
                                        <button
                                            onClick={() => canTrigger && setIsMonitoring(!isMonitoring)}
                                            disabled={!canTrigger}
                                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${isMonitoring ? 'bg-emerald-600' : 'bg-secondary'}`}
                                        >
                                            <span className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${isMonitoring ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    <Button
                                        variant="outline" className="w-full h-9 border-white/10 hover:bg-emerald-500/10 text-xs font-bold gap-2"
                                        onClick={() => canTrigger && syncWithLiveAPIs()} disabled={isSimulating || !canTrigger}
                                    >
                                        <RefreshCw className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                                        Resync Global Nodes
                                    </Button>
                                    <Button
                                        variant="outline" className="w-full h-9 border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold gap-2"
                                        onClick={() => canTrigger && restoreGrid()} disabled={isSimulating || !canTrigger}
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        System Cold Reset
                                    </Button>
                                </CardContent>
                            </Card>

                            <EarlyWarning />
                        </div>

                        {/* Map & Analytics - CENTER (Col 6) */}
                        <div className="col-span-12 lg:col-span-6 space-y-6">
                            <MapboxDetection />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DisasterAlerts alerts={alerts} />
                                <RiskClassification />
                            </div>
                            <EnergyChart data={energyData} />
                        </div>

                        {/* Right Panel - (Col 3) */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            <EnergyAllocation />
                            <BackupPower />
                            <ReportGenerator />
                        </div>
                    </div>
                )}

                {activeTab === 'logistics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ResourceManagement />
                        <EvacuationModule />
                        <div className="space-y-6">
                            <Card className="border-primary/20 bg-primary/5 p-6">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 italic font-display">
                                    <Activity className="w-5 h-5 text-primary" />
                                    RESPONSE PROTOCOL
                                </h3>
                                <div className="space-y-4">
                                    <ProtocolStep index={1} text="Isolate affected power sectors immediately." />
                                    <ProtocolStep index={2} text="Mobilize NDRF teams to active Red Zones." />
                                    <ProtocolStep index={3} text="Audit JIPMER backup fuel reserves (MOP Mode)." />
                                    <ProtocolStep index={4} text="Sync satellite data for terrain deformation." />
                                </div>
                            </Card>
                            <ReportGenerator />
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PredictiveAnalytics />
                        <LoadForecasting />
                        <div className="lg:col-span-2">
                            <EnergyChart data={energyData} />
                        </div>
                    </div>
                )}

                {activeTab === 'admin' && canTrigger && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <FailSafeMode />
                        <Card className="border-border bg-card p-6 lg:col-span-2">
                            <h3 className="text-xl font-black italic font-display mb-6">SYSTEM LOGS (ROOT)</h3>
                            <div className="font-mono text-[10px] space-y-1 text-muted-foreground bg-secondary/30 p-4 rounded-lg border border-border h-[300px] overflow-y-auto custom-scrollbar">
                                <div className="text-emerald-600">[SYSTEM] Auth validated for {user.name} ({user.role})</div>
                                <div className="text-indigo-600">[NODE] Connected to USGS Real-time Feed</div>
                                <div className="text-indigo-600">[NODE] Connected to GDACS RSS Layer</div>
                                <div className="text-indigo-600">[NODE] Connected to Open-Meteo API</div>
                                <div className="text-success">[GRID] Resonance steady at 50Hz</div>
                                <div className="text-success">[LOAD] Forecasting unit active and synced</div>
                                <div className="text-muted-foreground/60">[DEBUG] Handshake complete for Mapbox GL JS</div>
                                {alerts.map(a => (
                                    <div key={a.id} className="text-destructive">[ALERT] {a.type} detected at {a.location} - SEVERITY: {a.severity.toUpperCase()}</div>
                                ))}
                                <div className="animate-pulse text-primary tracking-widest text-center mt-4">--- END OF ACTIVE LOGS ---</div>
                            </div>
                        </Card>
                    </div>
                )}
            </main>

            {/* AI Assistant Overlay */}
            <div className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 p-4 rounded-full shadow-2xl transition-all group cursor-pointer border-4 border-indigo-400/20">
                <BarChart3 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-full right-0 mb-4 bg-white text-black text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold shadow-xl">
                    AI Insight: Grid under tension. (Res: {resilience}%)
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all
            ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
    >
        {icon}
        {label}
    </button>
);

const TriggerButton = ({ label, onClick, disabled }: { label: string, onClick: () => void, disabled: boolean }) => (
    <button
        onClick={onClick} disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40 border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <span className="text-[10px] font-mono text-primary font-bold uppercase">{label}</span>
        <Activity className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
    </button>
);

const ProtocolStep = ({ index, text }: { index: number, text: string }) => (
    <div className="flex gap-4 p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all group">
        <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 border border-primary/20">
            {index}
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
            {text}
        </p>
    </div>
);

export default Simulation;
