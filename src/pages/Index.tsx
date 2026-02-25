import { Activity, Zap, AlertTriangle, Shield, TrendingDown, Radio, Play, RefreshCw, BarChart3, Settings } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import DisasterAlerts from "@/components/DisasterAlerts";
import EnergyChart from "@/components/EnergyChart";
import ResilienceGauge from "@/components/ResilienceGauge";
import RiskClassification from "@/components/RiskClassification";
import EnergyAllocation from "@/components/EnergyAllocation";
import MapboxDetection from "@/components/MapboxDetection";
import StatCard from "@/components/StatCard";
import { useSimulation } from "@/context/SimulationContext";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/ReportModal";
import ExportButton from "@/components/ExportButton";
import { Link } from "react-router-dom";

const Index = () => {
  const { isSimulating, resilience, alerts, energyData, restoreGrid } = useSimulation();

  const currentDemand = energyData[4].demand; // Using 14:00 as current
  const currentSupply = energyData[4].supply;
  const currentShortfall = energyData[4].shortfall;

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 glow-primary">
                <Activity className={`h-5 w-5 text-primary ${isSimulating ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold tracking-wider text-foreground text-glow-primary">
                  DERSDP
                </h1>
                <p className="text-xs text-muted-foreground tracking-wide">
                  Disaster–Energy Resilience Simulation & Detection Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 mr-2">
                <span className={`h-2 w-2 rounded-full ${isSimulating ? 'bg-critical animate-ping' : 'bg-primary animate-pulse-glow'}`} />
                <span className="font-mono text-xs text-primary uppercase">{isSimulating ? 'CRISIS DETECTED' : 'SYSTEM ACTIVE'}</span>
              </div>

              <ReportModal />

              <div className="flex items-center gap-2">
                <ExportButton />
                <Link to="/simulation">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary gap-2"
                  >
                    <Settings className="h-4 w-4" /> Simulator Panel
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                  onClick={restoreGrid}
                  title="Reset Grid"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Real-time disaster detection, energy impact simulation, and optimized allocation
            for critical infrastructure. Monitoring seismic, weather, and grid data continuously.
          </p>
        </div>
      </header>

      {/* Stats Row */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Active Alerts" value={alerts.length.toString()} subtitle="Live monitoring" icon={AlertTriangle} variant={alerts.length > 3 ? "critical" : "warning"} />
          <StatCard title="Energy Demand" value={`${(currentDemand / 1000).toFixed(1)} GW`} subtitle="Peak current" icon={Zap} variant="warning" />
          <StatCard title="Grid Supply" value={`${(currentSupply / 1000).toFixed(1)} GW`} subtitle={`${((currentSupply / currentDemand) * 100).toFixed(0)}% capacity`} icon={TrendingDown} variant={currentSupply < currentDemand ? "critical" : "success"} />
          <StatCard title="Shortfall" value={`${(currentShortfall / 1000).toFixed(1)} GW`} subtitle={currentShortfall > 0 ? "Emergency mode" : "Stable"} icon={Zap} variant={currentShortfall > 0 ? "critical" : "default"} />
          <StatCard title="Resilience" value={`${resilience}/100`} subtitle={resilience > 60 ? "Moderate" : "Low"} icon={Shield} variant={resilience > 60 ? "default" : "critical"} />
          <StatCard title="Stations" value="14/18" subtitle="Online" icon={Radio} variant="success" />
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-5 lg:col-span-2">
            <EnergyChart data={energyData} />
            <div className="grid gap-5 md:grid-cols-2">
              <RiskClassification isCrisis={isSimulating} />
              <EnergyAllocation shortfall={currentShortfall} />
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-5">
            <MapboxDetection />
            <ResilienceGauge score={resilience} />
            <DisasterAlerts alerts={alerts} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">DERSDP v1.0 — Disaster–Energy Resilience Platform</span>
          <span className="font-mono text-xs text-muted-foreground">Last sync: Just now</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
