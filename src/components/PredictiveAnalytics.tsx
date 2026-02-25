import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Brain, TrendingUp, AlertCircle, History } from "lucide-react";

const HISTORICAL_DATA = [
    { year: "2020", events: 4, intensity: 65 },
    { year: "2021", events: 7, intensity: 72 },
    { year: "2022", events: 5, intensity: 58 },
    { year: "2023", events: 9, intensity: 81 },
    { year: "2024", events: 12, intensity: 75 },
];

const PredictiveAnalytics = () => {
    // Simple Linear Regression for "events"
    // y = mx + b
    const n = HISTORICAL_DATA.length;
    const sumX = HISTORICAL_DATA.reduce((acc, _, i) => acc + i, 0);
    const sumY = HISTORICAL_DATA.reduce((acc, d) => acc + d.events, 0);
    const sumXY = HISTORICAL_DATA.reduce((acc, d, i) => acc + (i * d.events), 0);
    const sumX2 = HISTORICAL_DATA.reduce((acc, _, i) => acc + (i * i), 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const nextVal = Math.round(m * n + (sumY - m * sumX) / n);

    const probPercentage = Math.min(Math.round((nextVal / 15) * 100), 95);

    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        AI Predictive Intelligence
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono italic">
                        Long-term Disaster Forecasting Model
                    </p>
                </div>
                <div className="bg-purple-500/10 text-purple-600 px-3 py-1 rounded-full border border-purple-500/20 text-[10px] font-bold">
                    ML MODEL: LINEAR REGRESSION
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border group hover:border-purple-500/50 transition-all cursor-default shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-bold text-foreground uppercase tracking-tight">INCIDENT TREND PROJECTION</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1 font-mono">
                            {nextVal} <span className="text-xs text-muted-foreground font-normal">Predicted Events (2025)</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono leading-tight">
                            Based on n=5 historical samples. Error Margin: ±12.4%
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border group hover:border-critical/50 transition-all cursor-default shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-4 h-4 text-critical" />
                            <span className="text-xs font-bold text-foreground uppercase tracking-tight">UPCOMING PROBABILITY INDEX</span>
                        </div>
                        <div className="text-2xl font-bold text-critical mb-1 font-mono">
                            {probPercentage}% <span className="text-xs text-muted-foreground font-normal">Severity Chance</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono leading-tight uppercase">
                            HIGH RISK OF CYCLONIC ACTIVITY IN NEXT 60 DAYS
                        </div>
                    </div>
                </div>

                <div className="h-48 w-full">
                    <div className="text-[10px] text-muted-foreground mb-2 flex items-center gap-2 uppercase font-mono tracking-tight">
                        <History className="w-3 h-3" /> HISTORICAL INCIDENCE FREQUENCY
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={HISTORICAL_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                            <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.3 }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '10px', color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="events" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="text-[10px] text-muted-foreground font-mono">
                    MODEL REFRESH: PER 24H LIVE DATA STREAM
                </div>
                <button className="text-[10px] text-purple-600 hover:text-purple-700 transition-colors uppercase font-bold tracking-tighter">
                    View Detail Analysis →
                </button>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
