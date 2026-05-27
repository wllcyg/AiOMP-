import {
  ArrowLeft,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  Heart,
  MessageSquare,
  RefreshCw,
  Share2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  FilterSelect,
  KpiCard,
  SearchInput,
  SectionTitle,
  StatusDot,
  Tabs,
  cn,
  type Project,
} from "../components";
import { projects } from "./MonitorListPage";

type DataRow = {
  id: string;
  title: string;
  source: string;
  author: string;
  publishedAt: string;
  tags: string[];
  views: string;
  likes: number;
  comments: number;
  shares: number;
  sentiment: "正面" | "负面" | "中性";
};

const mockRows: DataRow[] = [
  {
    id: "r1",
    title: "长安CS75 PLUS荣获传播全新亮相，外观设计大幅升级引发热议",
    source: "微信公众号",
    author: "汽车圈大爆料",
    publishedAt: "2026-04-10 14:32",
    tags: ["外观", "升级"],
    views: "12.8w",
    likes: 8921,
    comments: 1234,
    shares: 456,
    sentiment: "正面",
  },
  {
    id: "r2",
    title: "【深度测评】CS75 PLUS vs 哈弗H6：到底谁更值得买？",
    source: "汽车之家",
    author: "玩车王",
    publishedAt: "2026-04-10 12:15",
    tags: ["对比", "评测"],
    views: "9.0w",
    likes: 3240,
    comments: 567,
    shares: 215,
    sentiment: "正面",
  },
  {
    id: "r3",
    title: "长安CS75PLUS车主吐槽：导航系统糟糕不堪，官方至今没解决",
    source: "懂车帝",
    author: "车圈快讯",
    publishedAt: "2026-04-10 10:04",
    tags: ["车机", "投诉"],
    views: "4.5w",
    likes: 1890,
    comments: 692,
    shares: 315,
    sentiment: "负面",
  },
  {
    id: "r4",
    title: "销量黑马！长安CS75系列月销售突破3.2万辆创历史新高",
    source: "中汽研",
    author: "汽车数据观",
    publishedAt: "2026-04-09 18:30",
    tags: ["销量", "增长"],
    views: "6.8w",
    likes: 4120,
    comments: 234,
    shares: 178,
    sentiment: "正面",
  },
  {
    id: "r5",
    title: "小红书KOL种草视频：CS75 PLUS的性价比体感，女生也爱了！",
    source: "小红书",
    author: "甜甜の车日记",
    publishedAt: "2026-04-10 08:50",
    tags: ["KOL", "种草"],
    views: "3.5w",
    likes: 5870,
    comments: 445,
    shares: 89,
    sentiment: "正面",
  },
];

const tabs = [
  { key: "data", label: "详细数据" },
  { key: "stat", label: "统计展示" },
];

export function MonitorDetailPage({
  projectId,
  onBack,
}: {
  projectId: string;
  onBack?: () => void;
}) {
  const project: Project =
    projects.find((p) => p.id === projectId) ?? projects[0];

  return (
    <>
      <SectionTitle
        title="监测数据详情"
        action={
          <div className="flex items-center gap-2">
            <Button onClick={onBack} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              返回项目列表
            </Button>
            <Button variant="primary" leftIcon={<Download className="w-3.5 h-3.5" />}>
              导出数据
            </Button>
          </div>
        }
      />

      {/* Project info strip */}
      <Card className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <StatusDot tone="success" />
          <span className="h1-cn-medium text-foreground truncate">{project.name}</span>
          <Badge tone="brand">{project.type}</Badge>
          <Badge tone="success">{project.status}</Badge>
        </div>
        <div className="flex items-center gap-3 body12-cn-regular text-muted-foreground shrink-0">
          <span>
            监测关键词：
            <span className="text-foreground">长安CS75</span>
            <span className="text-muted-foreground"> ·（传播/口碑/评测）</span>
          </span>
          <Button size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>
            编辑配置
          </Button>
          <Button size="sm" leftIcon={<RefreshCw className="w-3 h-3" />}>
            手动刷新
          </Button>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="总声量"
          value="15,632"
          icon={TrendingUp}
          tone="brand"
          trend="up"
          trendValue="8.3%"
          trendLabel="vs 昨日"
        />
        <KpiCard
          label="评论量"
          value="8,921"
          icon={MessageSquare}
          tone="info"
          trend="up"
          trendValue="12.4%"
          trendLabel="vs 昨日"
        />
        <KpiCard
          label="负面声量占比"
          value="12%"
          icon={TrendingDown}
          tone="warning"
          trend="up"
          trendValue="3.1%"
          trendLabel="vs 昨日"
        />
        <KpiCard
          label="正面声量占比"
          value="65%"
          icon={Heart}
          tone="success"
          trend="up"
          trendValue="7.3%"
          trendLabel="vs 昨日"
        />
      </div>

      {/* Tabs */}
      <Tabs items={tabs} value="data" />

      {/* Filter */}
      <Card className="p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            placeholder="搜索关键词..."
            className="flex-1 min-w-[240px] max-w-[320px]"
          />
          <FilterSelect value="高级筛选" />
          <div className="flex-1" />
          <span className="body12-cn-regular text-muted-foreground">
            共 <span className="text-foreground">15,632</span> 条声量 ·{" "}
            <span className="text-foreground">8,921</span> 条评论
          </span>
          <Button size="sm" rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>
            声量 + 评论
          </Button>
          <Button size="sm" rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>
            发布时间
          </Button>
          <Button size="sm" rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>
            热度评分
          </Button>
        </div>
      </Card>

      {/* Data rows */}
      <div className="flex flex-col gap-2">
        {mockRows.map((row) => (
          <DataRowItem key={row.id} row={row} />
        ))}
      </div>
    </>
  );
}

function DataRowItem({ row }: { row: DataRow }) {
  const sentimentTone =
    row.sentiment === "正面" ? "success" : row.sentiment === "负面" ? "warning" : "neutral";
  return (
    <Card className="p-3 flex items-start gap-3">
      <input type="checkbox" className="mt-1.5 accent-primary" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h2-cn-medium text-foreground truncate">{row.title}</span>
        </div>
        <div className="flex items-center gap-2 body10-cn-regular text-muted-foreground">
          <span>{row.source}</span>
          <span>·</span>
          <span>{row.author}</span>
          <span>·</span>
          <span>{row.publishedAt}</span>
          {row.tags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-4 body12-cn-regular text-muted-foreground shrink-0",
        )}
      >
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" /> {row.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3" /> {row.likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> {row.comments.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Share2 className="w-3 h-3" /> {row.shares}
        </span>
        <Badge tone={sentimentTone}>{row.sentiment}</Badge>
        <Button size="sm">原文</Button>
        <Button size="sm">详情</Button>
        <Button size="sm">展开评论</Button>
      </div>
    </Card>
  );
}
