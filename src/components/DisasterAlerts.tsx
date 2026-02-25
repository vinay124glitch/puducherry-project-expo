import { AlertTriangle, Activity, Waves, Wind, Mountain } from "lucide-react";
import React from "react";

export type Severity = "critical" | "high" | "moderate" | "low";

export interface Alert {
  id: number;
  type: string;
  location: string;
  severity: Severity;
  time: string;
  iconType: "mountain" | "waves" | "wind" | "activity";
  radius?: number;
  coordinates?: [number, number];
}

const severityStyles: Record<string, string> = {
  critical: "bg-critical/10 text-critical border-critical/30 glow-critical",
  high: "bg-warning/10 text-warning border-warning/30",
  moderate: "bg-primary/10 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

const iconMap = {
  mountain: <Mountain className="h-4 w-4" />,
  waves: <Waves className="h-4 w-4" />,
  wind: <Wind className="h-4 w-4" />,
  activity: <Activity className="h-4 w-4" />,
};

const DisasterAlerts = ({ alerts }: { alerts: Alert[] }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Live Disaster Alerts
        </h3>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-critical animate-pulse-glow" />
          <span className="font-mono text-xs text-critical">LIVE</span>
        </span>
      </div>
      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all hover:scale-[1.01] ${severityStyles[alert.severity]}`}
          >
            <div className="flex-shrink-0">{iconMap[alert.iconType]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{alert.type}</p>
              <p className="text-xs opacity-70">
                {alert.location} {alert.radius && <span className="text-[10px] font-mono text-primary/80 ml-1">({alert.radius.toFixed(0)}km radius)</span>}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide">
                {alert.severity}
              </span>
              <span className="font-mono text-[10px] opacity-50">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisasterAlerts;
