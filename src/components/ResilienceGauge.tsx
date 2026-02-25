import { Shield } from "lucide-react";

interface ResilienceGaugeProps {
  score: number;
}

const ResilienceGauge = ({ score = 62 }: ResilienceGaugeProps) => {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return "text-success";
    if (s >= 50) return "text-warning";
    return "text-critical";
  };

  const getStroke = (s: number) => {
    if (s >= 75) return "hsl(142, 71%, 45%)";
    if (s >= 50) return "hsl(38, 92%, 50%)";
    return "hsl(0, 84%, 60%)";
  };

  const getLabel = (s: number) => {
    if (s >= 75) return "RESILIENT";
    if (s >= 50) return "MODERATE";
    return "CRITICAL";
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Resilience Score
        </h3>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="10"
              opacity={0.3}
            />
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={getStroke(score)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${getStroke(score)})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono text-4xl font-bold ${getColor(score)}`}>{score}</span>
            <span className="font-mono text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <span className={`mt-3 rounded-full border px-3 py-1 font-display text-xs font-semibold tracking-widest ${getColor(score)} border-current/30`}>
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
};

export default ResilienceGauge;
