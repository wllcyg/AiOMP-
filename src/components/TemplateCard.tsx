import {
  MoreHorizontal,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Badge, Button, Card, cn } from "./ui";

export type TemplateType = "专项报告模板" | "周期报告模板";
export type TemplateStatus = "已发布" | "草稿箱" | "已归档";

export type CoverTone = "green" | "red" | "purple" | "orange" | "pink" | "blue" | "teal";

const coverStyles: Record<CoverTone, { bg: string; fg: string }> = {
  green: { bg: "bg-[var(--success-bg)]", fg: "text-[var(--success)]" },
  red: { bg: "bg-[var(--brand-bg)]", fg: "text-[var(--destructive)]" },
  purple: { bg: "bg-[var(--purple-bg)]", fg: "text-[var(--purple)]" },
  orange: { bg: "bg-[var(--warning-bg)]", fg: "text-[var(--warning)]" },
  pink: { bg: "bg-[#fdeef0]", fg: "text-[#e11d48]" },
  blue: { bg: "bg-[var(--info-bg)]", fg: "text-[var(--info)]" },
  teal: { bg: "bg-[var(--teal-bg)]", fg: "text-[var(--teal)]" },
};

export type Template = {
  id: string;
  name: string;
  subtitle: string;
  type: TemplateType;
  status: TemplateStatus;
  owner: string;
  category: string;
  version: string;
  cover: { icon: LucideIcon; tone: CoverTone };
  favorite?: boolean;
};

const typeTone: Record<TemplateType, "brand" | "info"> = {
  专项报告模板: "brand",
  周期报告模板: "info",
};

const statusTone: Record<TemplateStatus, "success" | "warning" | "neutral"> = {
  已发布: "success",
  草稿箱: "warning",
  已归档: "neutral",
};

export type TemplateAction =
  | { key: "edit"; label: string }
  | { key: "use"; label: string }
  | { key: "preview"; label: string }
  | { key: "delete"; label: string }
  | { key: "unarchive"; label: string };

const defaultActionsFor = (status: TemplateStatus): TemplateAction[] => {
  if (status === "草稿箱")
    return [
      { key: "edit", label: "继续编辑" },
      { key: "preview", label: "预览" },
    ];
  if (status === "已归档")
    return [
      { key: "use", label: "使用模板" },
      { key: "preview", label: "预览" },
    ];
  return [
    { key: "edit", label: "编辑" },
    { key: "use", label: "使用模板" },
    { key: "preview", label: "预览" },
  ];
};

export function TemplateCard({
  t,
  actions,
  onAction,
  onToggleFavorite,
}: {
  t: Template;
  actions?: TemplateAction[];
  onAction?: (key: TemplateAction["key"]) => void;
  onToggleFavorite?: () => void;
}) {
  const Cover = t.cover.icon;
  const cs = coverStyles[t.cover.tone];
  const acts = actions ?? defaultActionsFor(t.status);

  return (
    <Card
      className={cn(
        "p-3 flex flex-col gap-3",
        "hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all",
      )}
    >
      {/* Cover */}
      <div
        className={cn(
          "relative rounded-md h-[110px] flex flex-col items-center justify-center gap-1.5",
          "bg-[var(--input-background)] border border-dashed border-border",
        )}
      >
        
        <span className="body10-cn-regular text-muted-foreground">暂无封面图</span>
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-white/80 flex items-center justify-center transition-colors"
          aria-label="收藏"
        >
          <Star
            className={cn(
              "w-3.5 h-3.5",
              t.favorite
                ? "fill-[var(--warning)] text-[var(--warning)]"
                : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h1-cn-medium text-foreground truncate flex-1">{t.name}</div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Badge tone={typeTone[t.type]}>{t.type}</Badge>
            <Badge tone={statusTone[t.status]}>{t.status}</Badge>
          </div>
        </div>
        <div className="body12-cn-regular text-muted-foreground truncate">{t.subtitle}</div>
        <div className="body10-cn-regular text-muted-foreground mt-1 truncate">
          创建人·{t.owner} · {t.category} <span className="text-foreground">{t.version}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-border">
        <div className="flex items-center gap-1 flex-wrap">
          {acts.map((a, i) => (
            <Button
              key={a.key}
              size="sm"
              variant={i === 0 ? "primary" : "secondary"}
              onClick={() => onAction?.(a.key)}
            >
              {a.label}
            </Button>
          ))}
        </div>
        <Button size="sm" className="w-7 px-0 justify-center shrink-0">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
