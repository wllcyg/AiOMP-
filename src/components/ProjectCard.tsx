import {
  CalendarDays,
  Database,
  Edit3,
  MessageSquare,
  MoreHorizontal,
  Radio,
} from "lucide-react";
import { Badge, Button, StatusDot, cn } from "./ui";

export type Sentiment = { pos: number; neg: number; neu: number };
export type ProjectStatus = "运行中" | "已暂停" | "归档";
export type ProjectType = "关键词监测" | "媒体账号监测";
export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  dataCount: number;
  comments: number;
  createdAt: string;
  platforms: string[];
  sentiment: Sentiment;
};

const statusTone = {
  运行中: "success",
  已暂停: "warning",
  归档: "neutral",
} as const;

export function SentimentBar({ s }: { s: Sentiment }) {
  return (
    <div className="flex items-center gap-3 body12-cn-regular">
      <span className="flex items-center gap-1 text-[#2ba471]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
        正 {s.pos}%
      </span>
      <span className="flex items-center gap-1 text-[var(--destructive)]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--destructive)]" />
        负 {s.neg}%
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--neutral)]" />
        中 {s.neu}%
      </span>
    </div>
  );
}

export function ProjectCard({ p, onClick }: { p: Project; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] border border-transparent",
        "hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all",
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusDot tone={statusTone[p.status]} />
          <span className="h1-cn-medium text-foreground">{p.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={p.type === "媒体账号监测" ? "info" : "brand"}>{p.type}</Badge>
          <Badge tone={statusTone[p.status]}>{p.status}</Badge>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 body12-cn-regular text-muted-foreground">
          <Meta icon={<Database className="w-3.5 h-3.5" />} label="数据量" value={p.dataCount.toLocaleString()} />
          <Meta icon={<MessageSquare className="w-3.5 h-3.5" />} label="评论量" value={p.comments.toLocaleString()} />
          <Meta icon={<CalendarDays className="w-3.5 h-3.5" />} label="创建于" value={p.createdAt} />
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span className="text-foreground truncate max-w-[220px]">
              {p.platforms.join("、")}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <SentimentBar s={p.sentiment} />
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>
              编辑配置
            </Button>
            <Button size="sm" className="w-7 px-0 justify-center">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      {label} <span className="text-foreground">{value}</span>
    </span>
  );
}
