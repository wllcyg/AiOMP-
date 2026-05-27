import {
  CheckCircle2,
  ChevronDown,
  Coins,
  Filter,
  FolderOpen,
  Plus,
  RotateCcw,
  Settings2,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Card,
  FilterSelect,
  KpiCard,
  Pagination,
  ProjectCard,
  SearchInput,
  SectionTitle,
  Tabs,
  type Project,
} from "../components";

export const projects: Project[] = [
  {
    id: "1",
    name: "吉利星越L品牌监测",
    type: "关键词监测",
    status: "运行中",
    dataCount: 9876,
    comments: 4321,
    createdAt: "2026-04-08",
    platforms: ["抖音", "快手", "微信视频号"],
    sentiment: { pos: 68, neg: 10, neu: 22 },
  },
  {
    id: "2",
    name: "理想L9用户口碑监测",
    type: "关键词监测",
    status: "运行中",
    dataCount: 6789,
    comments: 2341,
    createdAt: "2026-04-05",
    platforms: ["小红书", "新浪微博"],
    sentiment: { pos: 80, neg: 5, neu: 15 },
  },
  {
    id: "3",
    name: "长安CS75Plus品牌传播监测",
    type: "关键词监测",
    status: "运行中",
    dataCount: 15832,
    comments: 8921,
    createdAt: "2026-04-01",
    platforms: ["抖音", "快手"],
    sentiment: { pos: 65, neg: 12, neu: 23 },
  },
  {
    id: "4",
    name: "蔚来ET9上市传播监测",
    type: "媒体账号监测",
    status: "运行中",
    dataCount: 8430,
    comments: 3210,
    createdAt: "2026-03-28",
    platforms: ["汽车之家", "易车网", "懂车帝"],
    sentiment: { pos: 72, neg: 8, neu: 20 },
  },
  {
    id: "5",
    name: "问界M9竞品舆情监测",
    type: "关键词监测",
    status: "已暂停",
    dataCount: 5432,
    comments: 2100,
    createdAt: "2026-03-20",
    platforms: ["央媒", "省媒"],
    sentiment: { pos: 52, neg: 25, neu: 23 },
  },
];

const tabs = [
  { key: "all", label: "全部项目", count: projects.length },
  { key: "running", label: "运行中", count: 4 },
  { key: "paused", label: "已暂停", count: 2 },
  { key: "archived", label: "归档", count: 2 },
];

export function MonitorListPage({
  onOpenProject,
}: {
  onOpenProject?: (id: string) => void;
}) {
  return (
    <>
      <SectionTitle
        title="监测项目列表"
        action={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            新建监测项目
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="监测项目总数"
          value="8"
          icon={FolderOpen}
          tone="success"
          trend="up"
          trendValue="3"
          trendLabel="本月新增"
        />
        <KpiCard
          label="运行中项目"
          value="4"
          icon={CheckCircle2}
          tone="purple"
          trend="ok"
          trendLabel="正常运行中"
        />
        <KpiCard
          label="今日新增数据"
          value="12,847"
          icon={TrendingUp}
          tone="info"
          trend="up"
          trendValue="10.3%"
          trendLabel="vs 昨日"
        />
        <KpiCard
          label="今日消耗豆豆"
          value="1,240"
          icon={Coins}
          tone="teal"
          trend="ok"
          trendLabel="今日已用"
        />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            placeholder="搜索项目名称..."
            className="flex-1 min-w-[240px] max-w-[320px]"
          />
          <FilterSelect label="状态" value="全部" />
          <FilterSelect label="监测类型" value="全部" />
          <FilterSelect label="平台" value="全部平台" />
          <div className="flex-1" />
          <Button variant="primary" leftIcon={<Filter className="w-3.5 h-3.5" />}>
            筛选
          </Button>
          <Button leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>重置</Button>
          <Button leftIcon={<Settings2 className="w-3.5 h-3.5" />}>分类设置</Button>
        </div>
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <span className="body12-cn-regular text-muted-foreground">分类筛选：</span>
          <FilterSelect label="车企" value="全部车企" />
          <FilterSelect label="品牌" value="全部品牌" />
          <FilterSelect label="车型" value="全部车型" />
        </div>
      </Card>

      <Tabs
        items={tabs}
        value="all"
        right={
          <div className="flex items-center gap-2">
            <span className="body12-cn-regular text-muted-foreground">排序：</span>
            <Button size="sm" rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>
              监测创建时间
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} onClick={() => onOpenProject?.(p.id)} />
        ))}
      </div>

      <Pagination total={8} current={1} pageCount={2} />
    </>
  );
}
