import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Zap } from "lucide-react";

interface EnergyData {
  time: string;
  demand: number;
  supply: number;
  shortfall: number;
}

const EnergyChart = ({ data }: { data: EnergyData[] }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Energy Demand vs Supply
        </h3>
        <span className="ml-auto font-mono text-xs text-muted-foreground">MW · 24h</span>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(175, 85%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(175, 85%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="shortfallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="JetBrains Mono" />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="JetBrains Mono" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
                fontFamily: "JetBrains Mono",
                fontSize: 12,
              }}
              itemStyle={{ fontSize: 11 }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontFamily: "Inter", color: "hsl(var(--foreground))" }} />
            <Area type="monotone" dataKey="demand" stroke="hsl(175, 85%, 45%)" fill="url(#demandGrad)" strokeWidth={2} name="Demand (MW)" />
            <Area type="monotone" dataKey="supply" stroke="hsl(142, 71%, 45%)" fill="url(#supplyGrad)" strokeWidth={2} name="Supply (MW)" />
            <Area type="monotone" dataKey="shortfall" stroke="hsl(0, 84%, 60%)" fill="url(#shortfallGrad)" strokeWidth={2} name="Shortfall (MW)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
