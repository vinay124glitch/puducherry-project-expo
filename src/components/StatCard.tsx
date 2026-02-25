import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "warning" | "critical" | "success";
}

const variantStyles: Record<string, string> = {
  default: "border-border",
  warning: "border-warning/20 glow-warning",
  critical: "border-critical/20 glow-critical",
  success: "border-success/20 glow-success",
};

const iconVariant: Record<string, string> = {
  default: "text-primary",
  warning: "text-warning",
  critical: "text-critical",
  success: "text-success",
};

const StatCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) => {
  return (
    <div className={`rounded-lg border bg-card p-4 transition-all hover:scale-[1.02] ${variantStyles[variant]}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</span>
        <Icon className={`h-4 w-4 ${iconVariant[variant]}`} />
      </div>
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default StatCard;
