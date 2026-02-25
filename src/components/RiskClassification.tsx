import React from "react";
import { MapPin, Info } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

interface Region {
  name: string;
  population: string;
  baseResilience: number;
}

const REGIONS: Region[] = [
  { name: "Puducherry City", population: "650K", baseResilience: 85 },
  { name: "Oulgaret", population: "310K", baseResilience: 78 },
  { name: "Ariyankuppam", population: "150K", baseResilience: 72 },
  { name: "Villianur", population: "220K", baseResilience: 68 },
  { name: "Bahour Sector", population: "120K", baseResilience: 60 },
];

const RiskClassification = () => {
  const { resilience, isSimulating } = useSimulation();

  // The global resilience affects all regions differently
  // For simulation, we'll derive regional scores from the global one
  const getRegionalScore = (base: number) => {
    const factor = resilience / 82; // Normalized to baseline
    return Math.max(0, Math.min(100, Math.round(base * factor)));
  };

  const getZone = (score: number) => {
    if (score <= 30) return { label: "Red Zone", color: "bg-red-500", text: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/10" };
    if (score <= 60) return { label: "Orange Zone", color: "bg-orange-500", text: "text-orange-500", border: "border-orange-500/30", bg: "bg-orange-500/10" };
    return { label: "Green Zone", color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10" };
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Territorial Risk Classification
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded border border-border">
          <Info className="w-3 h-3 text-muted-foreground" />
          <span className="text-[9px] text-muted-foreground uppercase font-mono">Real-time Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {REGIONS.map((region) => {
          const score = getRegionalScore(region.baseResilience);
          const zone = getZone(score);

          return (
            <div key={region.name} className={`rounded-lg border transition-all duration-500 ${zone.border} ${zone.bg} p-4`}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-foreground block">{region.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">POPULATION: {region.population}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${zone.border} ${zone.text}`}>
                    {zone.label}
                  </span>
                  <div className="text-lg font-bold text-foreground font-mono mt-1">{score}%</div>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary border border-border/50">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isSimulating ? 'animate-pulse' : ''} ${zone.color}`}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[8px] font-mono text-muted-foreground">
                <span>DANGER</span>
                <span>RESILIENCE LEVEL</span>
                <span>SECURE</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-2">
          <LegendItem color="bg-red-500" label="0-30: RED" />
          <LegendItem color="bg-orange-500" label="31-60: ORG" />
          <LegendItem color="bg-emerald-500" label="61-100: GRN" />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[8px] font-bold text-muted-foreground font-mono">{label}</span>
  </div>
);

export default RiskClassification;
