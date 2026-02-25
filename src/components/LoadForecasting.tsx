import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, BarChart3, Clock } from "lucide-react";

const FORECAST_DATA = [
    { time: "00:00", actual: 4200, forecast: 4100 },
    { time: "04:00", actual: 3800, forecast: 3750 },
    { time: "08:00", actual: 5200, forecast: 5100 },
    { time: "12:00", actual: 6800, forecast: 6600 },
    { time: "16:00", actual: null, forecast: 7100 },
    { time: "20:00", actual: null, forecast: 5400 },
    { time: "00:00+", actual: null, forecast: 4300 },
];

const LoadForecasting = () => {
    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Load Forecasting Module
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Time-Series Energy Demand Prediction
                    </p>
                </div>
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">NEXT 12H WINDOW</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <ForecastMetric label="Predicted Peak" value="7.1 GW" sub="At 16:00" />
                <ForecastMetric label="Forecast Accuracy" value="98.2%" sub="High Confidence" />
                <ForecastMetric label="Var. Threshold" value="±250 MW" sub="Alert Margin" />
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FORECAST_DATA}>
                        <defs>
                            <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '10px', color: 'hsl(var(--foreground))' }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="forecast"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#forecastColor)"
                            name="Projected"
                        />
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="hsl(var(--foreground))"
                            strokeWidth={3}
                            fill="transparent"
                            name="Actual"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center gap-2 p-3 bg-secondary/40 border border-border rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <p className="text-[9px] text-muted-foreground leading-tight">
                    <strong>AI INSIGHT:</strong> Solar output drop predicted for Villianur sector starting 17:30. Recommend early stabilization of Peaker Plants.
                </p>
            </div>
        </div>
    );
};

const ForecastMetric = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div className="p-3 bg-secondary/50 border border-border rounded-lg text-center shadow-sm">
        <div className="text-[9px] text-muted-foreground uppercase font-mono mb-1">{label}</div>
        <div className="text-lg font-black text-foreground font-mono">{value}</div>
        <div className="text-[8px] text-primary font-mono italic">{sub}</div>
    </div>
);

export default LoadForecasting;
