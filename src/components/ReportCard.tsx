import { MoreHorizontal, Share2, Eye } from "lucide-react";
import { Badge, Button, Card, cn } from "./ui";

export type ReportType = "专项报告" | "周期报告";
export type ReportStatus = "已发布" | "草稿箱" | "已归档";

export type ReportMetric = {
  value: string;
  label: string;
  tone?: "default" | "success" | "warning" | "destructive";
};

export type Report = {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  type: ReportType;
  status: ReportStatus;
  metrics: [ReportMetric, ReportMetric, ReportMetric, ReportMetric];
  owner: string;
  publishedAt: string;
};

const typeTone: Record<ReportType, "brand" | "info"> = {
  专项报告: "brand",
  周期报告: "info",
};

const statusTone: Record<ReportStatus, "success" | "warning" | "neutral"> = {
  已发布: "success",
  草稿箱: "warning",
  已归档: "neutral",
};

const metricToneClass: Record<NonNullable<ReportMetric["tone"]>, string> = {
  default: "text-foreground",
  success: "text-[#2ba471]",
  warning: "text-[var(--warning)]",
  destructive: "text-[var(--destructive)]",
};

export function ReportCard({ r }: { r: Report }) {
  return (
    <Card
      className={cn(
        "p-4 flex flex-col gap-3",
        "hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="h1-cn-medium text-foreground truncate">{r.name}</div>
          <div className="body10-cn-regular text-muted-foreground mt-1 truncate">
            {r.code} · {r.subtitle}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge tone={typeTone[r.type]}>{r.type}</Badge>
          <Badge tone={statusTone[r.status]}>{r.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-md bg-[var(--input-background)] p-3">
        {r.metrics.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-1 text-center">
            <span
              className={cn(
                "text-[18px] font-semibold leading-none",
                metricToneClass[m.tone ?? "default"],
              )}
            >
              {m.value}
            </span>
            <span className="body10-cn-regular text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="body10-cn-regular text-muted-foreground">
          <span className="text-foreground">{r.owner}</span> · {r.publishedAt}
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" leftIcon={<Eye className="w-3 h-3" />}>
            查看
          </Button>
          <Button size="sm" leftIcon={<Share2 className="w-3 h-3" />}>
            分享
          </Button>
          <Button size="sm" className="w-7 px-0 justify-center">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
