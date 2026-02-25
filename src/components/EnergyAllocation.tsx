import { Battery, Building2, Heart, Radio, Droplets, Factory, Home, ShoppingBag, Zap, AlertTriangle } from "lucide-react";
import React from "react";
import { useSimulation } from "@/context/SimulationContext";

interface PriorityNode {
  name: string;
  type: string;
  demandMW: number;
  priority: number; // 1-6
  icon: React.ReactNode;
}

const PRIORITY_NODES: PriorityNode[] = [
  { name: "JIPMER & General Hospitals", type: "Healthcare", demandMW: 450, priority: 1, icon: <Heart className="h-4 w-4" /> },
  { name: "Emergency Control Centers", type: "Emergency", demandMW: 150, priority: 2, icon: <Radio className="h-4 w-4" /> },
  { name: "Water Supply & Pumping", type: "Utilities", demandMW: 200, priority: 3, icon: <Droplets className="h-4 w-4" /> },
  { name: "Communication Towers", type: "Telecom", demandMW: 100, priority: 4, icon: <Zap className="h-4 w-4" /> },
  { name: "Residential Grids", type: "Domestic", demandMW: 1200, priority: 5, icon: <Home className="h-4 w-4" /> },
  { name: "Commercial & Industrial", type: "Business", demandMW: 800, priority: 6, icon: <ShoppingBag className="h-4 w-4" /> },
];

const EnergyAllocation = () => {
  const { energyData } = useSimulation();
  // Using current baseline (index 4 - 14:00) for real-time look
  const currentData = energyData[4];
  const availableSupply = currentData.supply;
  const totalDemand = currentData.demand;
  const shortfall = currentData.shortfall;

  // Strict Priority Allocation Algorithm
  let remainingSupply = availableSupply;
  const allocations = PRIORITY_NODES.sort((a, b) => a.priority - b.priority).map(node => {
    const allocated = Math.min(node.demandMW, remainingSupply);
    remainingSupply -= allocated;

    let status: 'Nominal' | 'Throttled' | 'Offline' = 'Nominal';
    if (allocated === 0) status = 'Offline';
    else if (allocated < node.demandMW) status = 'Throttled';

    return {
      ...node,
      allocated,
      status,
      percentage: (allocated / node.demandMW) * 100
    };
  });

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Priority Resource Allocation
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
            Autonomous Decision Engine v4.0
          </p>
        </div>
        <div className="text-right">
          <div className={`text-xs font-bold font-mono ${shortfall > 0 ? 'text-critical' : 'text-success'}`}>
            GRID STATUS: {shortfall > 0 ? 'CRITICAL SHORTAGE' : 'STABLE'}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            SUPPLY: {availableSupply} MW / DEMAND: {totalDemand} MW
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {allocations.map((item) => (
          <div key={item.name} className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${item.status === 'Nominal' ? 'bg-green-500/20 text-green-500' :
                  item.status === 'Throttled' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    {item.name}
                    <span className="text-[8px] px-1 bg-secondary border border-border text-muted-foreground rounded">
                      P{item.priority}
                    </span>
                  </div>
                  <div className="text-[9px] text-muted-foreground font-mono italic">{item.status}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-foreground">
                  {item.allocated} <span className="text-[9px] text-muted-foreground">MW</span>
                </div>
                <div className="text-[9px] text-muted-foreground/80">Req: {item.demandMW}MW</div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${item.status === 'Nominal' ? 'bg-green-500' :
                  item.status === 'Throttled' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            {item.status !== 'Nominal' && (
              <div className="mt-1 flex items-center gap-1 text-[8px] text-critical font-mono">
                <AlertTriangle className="w-2 h-2" />
                LOAD SHEDDING ACTIVE: Priority {item.priority} affected
              </div>
            )}
          </div>
        ))}
      </div>

      {shortfall > 0 && (
        <div className="mt-6 p-3 bg-critical/10 border border-critical/20 rounded-lg">
          <div className="text-[10px] font-bold text-critical mb-1 uppercase tracking-tighter">Emergency Protocol Recommendation</div>
          <p className="text-[9px] text-muted-foreground leading-tight">
            System has automatically disconnected <strong>Priority 6 & 5</strong> loads to protect <strong>Critical Infrastructure (P1-P3)</strong>.
            Redirecting {shortfall} MW shortfall from non-essential sectors.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnergyAllocation;
