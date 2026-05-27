import * as React from "react";
import { CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./ui";

export type KpiTone = "success" | "info" | "purple" | "teal" | "warning" | "brand";

const toneStyles: Record<KpiTone, { bg: string; fg: string }> = {
  success: { bg: "bg-[var(--success-bg)]", fg: "text-[var(--success)]" },
  info: { bg: "bg-[var(--info-bg)]", fg: "text-[var(--info)]" },
  purple: { bg: "bg-[var(--purple-bg)]", fg: "text-[var(--purple)]" },
  teal: { bg: "bg-[var(--teal-bg)]", fg: "text-[var(--teal)]" },
  warning: { bg: "bg-[var(--warning-bg)]", fg: "text-[var(--warning)]" },
  brand: { bg: "bg-[var(--brand-bg)]", fg: "text-primary" },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "info",
  trend,
  trendValue,
  trendLabel,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: KpiTone;
  trend?: "up" | "down" | "ok";
  trendValue?: string;
  trendLabel?: string;
}) {
  const TrendIcon =
    trend === "down" ? TrendingDown : trend === "up" ? TrendingUp : CheckCircle2;
  const trendColor =
    trend === "down" ? "text-[var(--destructive)]" : "text-[var(--success)]";
  const t = toneStyles[tone];

  return (
    <Card className="p-5 flex items-start justify-between hover:border-border transition-colors">
      <div className="flex flex-col gap-2.5">
        <span className="body12-cn-regular text-muted-foreground">{label}</span>
        <span className="text-[28px] leading-none font-semibold text-foreground tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`flex items-center gap-1 body12-cn-regular ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trendValue && <span>{trendValue}</span>}
            {trendLabel && (
              <span className="text-muted-foreground ml-0.5">{trendLabel}</span>
            )}
          </span>
        )}
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.bg}`}>
        <Icon className={`w-[18px] h-[18px] ${t.fg}`} />
      </div>
    </Card>
  );
}
