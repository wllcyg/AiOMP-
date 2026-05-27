import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Coins,
  Database,
  Edit3,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  FilterSelect,
  IconButton,
  KpiCard,
  Pagination,
  SearchInput,
  SectionTitle,
  StatusDot,
  Tabs,
  cn,
} from "../components";

/* ============================ 账号管理 ============================ */
type Account = {
  id: string;
  name: string;
  initial: string;
  account: string;
  role: "超级管理员" | "管理员" | "分析师" | "查看者";
  dept: string;
  quota: number;
  used: number;
  status: "启用" | "禁用";
};

const accounts: Account[] = [
  { id: "1", name: "张三丰", initial: "张", account: "zhangsf", role: "超级管理员", dept: "产品中心", quota: 20000, used: 7420, status: "启用" },
  { id: "2", name: "李四", initial: "李", account: "lisi", role: "管理员", dept: "市场部", quota: 10000, used: 4380, status: "启用" },
  { id: "3", name: "王五", initial: "王", account: "wangwu", role: "分析师", dept: "数据中心", quota: 8000, used: 6210, status: "启用" },
  { id: "4", name: "赵六", initial: "赵", account: "zhaoliu", role: "分析师", dept: "公关部", quota: 6000, used: 1820, status: "启用" },
  { id: "5", name: "孙七", initial: "孙", account: "sunqi", role: "查看者", dept: "战略部", quota: 3000, used: 0, status: "禁用" },
];

export function AccountPage() {
  return (
    <>
      <SectionTitle
        title="账号管理"
        action={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            新增账号
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="账号总数" value="12" icon={Users} tone="info" trend="ok" trendLabel="本月新增 2" />
        <KpiCard label="启用账号" value="10" icon={CheckCircle2} tone="success" trend="ok" trendLabel="正常使用" />
        <KpiCard label="总额度" value="80,000" icon={Coins} tone="brand" trend="ok" trendLabel="洞察豆" />
        <KpiCard label="本月已消耗" value="36,420" icon={Database} tone="purple" trend="up" trendValue="45.5%" trendLabel="已用占比" />
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput placeholder="搜索账号 / 姓名" className="flex-1 min-w-[240px] max-w-[320px]" />
          <FilterSelect label="角色" value="全部" />
          <FilterSelect label="部门" value="全部" />
          <FilterSelect label="状态" value="全部" />
          <div className="flex-1" />
          <Button leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>重置</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1.4fr_0.8fr_1fr] body12-cn-medium text-muted-foreground bg-[var(--input-background)] px-4 h-10 items-center">
          <span>账号</span>
          <span>角色</span>
          <span>部门</span>
          <span>额度 / 已用</span>
          <span>状态</span>
          <span className="text-right">操作</span>
        </div>
        {accounts.map((a) => {
          const pct = Math.round((a.used / a.quota) * 100);
          return (
            <div
              key={a.id}
              className="grid grid-cols-[1.6fr_1fr_1fr_1.4fr_0.8fr_1fr] px-4 h-14 items-center border-t border-border body12-cn-regular text-foreground"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center body12-cn-medium">
                  {a.initial}
                </div>
                <div className="flex flex-col leading-tight">
                  <span>{a.name}</span>
                  <span className="body10-cn-regular text-muted-foreground">@{a.account}</span>
                </div>
              </div>
              <span>{a.role}</span>
              <span className="text-muted-foreground">{a.dept}</span>
              <div className="flex flex-col gap-1 pr-4">
                <span className="body10-cn-regular text-muted-foreground">
                  {a.used.toLocaleString()} / {a.quota.toLocaleString()}
                </span>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      pct > 80 ? "bg-[var(--warning)]" : "bg-primary",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <Badge tone={a.status === "启用" ? "success" : "neutral"}>{a.status}</Badge>
              <div className="flex items-center gap-1 justify-end">
                <Button size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>编辑</Button>
                <Button size="sm" className="w-7 px-0 justify-center">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </Card>

      <Pagination total={accounts.length} current={1} pageCount={1} />
    </>
  );
}

/* ============================ 刷新记录日志 ============================ */
type LogRow = {
  id: string;
  time: string;
  type: "自动刷新" | "手动刷新" | "数据导出";
  project: string;
  cost: number;
  operator: string;
  status: "成功" | "失败" | "进行中";
};

const logs: LogRow[] = [
  { id: "1", time: "2026-04-15 14:32:08", type: "自动刷新", project: "吉利星越L品牌监测", cost: 12, operator: "系统", status: "成功" },
  { id: "2", time: "2026-04-15 14:30:22", type: "手动刷新", project: "理想L9用户口碑监测", cost: 8, operator: "张三丰", status: "成功" },
  { id: "3", time: "2026-04-15 14:15:00", type: "自动刷新", project: "长安CS75Plus品牌传播监测", cost: 18, operator: "系统", status: "成功" },
  { id: "4", time: "2026-04-15 13:58:11", type: "数据导出", project: "蔚来ET9上市传播监测", cost: 0, operator: "李四", status: "成功" },
  { id: "5", time: "2026-04-15 13:42:43", type: "手动刷新", project: "问界M9竞品舆情监测", cost: 6, operator: "王五", status: "失败" },
  { id: "6", time: "2026-04-15 13:30:00", type: "自动刷新", project: "吉利星越L品牌监测", cost: 12, operator: "系统", status: "进行中" },
];

const statusToneMap = {
  成功: "success",
  失败: "brand",
  进行中: "info",
} as const;

export function RefreshLogPage() {
  return (
    <>
      <SectionTitle title="刷新记录日志" />

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput placeholder="搜索项目名称" className="flex-1 min-w-[240px] max-w-[320px]" />
          <FilterSelect label="操作类型" value="全部" />
          <FilterSelect label="操作人" value="全部" />
          <FilterSelect label="状态" value="全部" />
          <FilterSelect label="时间" value="近 7 天" />
          <div className="flex-1" />
          <Button leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>重置</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_2fr_0.7fr_0.9fr_0.7fr] body12-cn-medium text-muted-foreground bg-[var(--input-background)] px-4 h-10 items-center">
          <span>时间</span>
          <span>类型</span>
          <span>项目名称</span>
          <span>消耗豆豆</span>
          <span>操作人</span>
          <span>状态</span>
        </div>
        {logs.map((l) => (
          <div
            key={l.id}
            className="grid grid-cols-[1.4fr_1fr_2fr_0.7fr_0.9fr_0.7fr] px-4 h-12 items-center border-t border-border body12-cn-regular"
          >
            <span className="text-muted-foreground">{l.time}</span>
            <span className="text-foreground">{l.type}</span>
            <span className="text-foreground truncate">{l.project}</span>
            <span className={cn(l.cost > 0 ? "text-foreground" : "text-muted-foreground")}>
              {l.cost > 0 ? `-${l.cost}` : "—"}
            </span>
            <span className="text-foreground">{l.operator}</span>
            <Badge tone={statusToneMap[l.status]}>{l.status}</Badge>
          </div>
        ))}
      </Card>

      <Pagination total={logs.length} current={1} pageCount={1} />
    </>
  );
}

/* ============================ 互动量刷新管理 ============================ */
type RefreshRule = {
  id: string;
  project: string;
  freq: string;
  window: string;
  lastRun: string;
  enabled: boolean;
};

const rules: RefreshRule[] = [
  { id: "1", project: "吉利星越L品牌监测", freq: "每 30 分钟", window: "08:00 — 22:00", lastRun: "14:30", enabled: true },
  { id: "2", project: "理想L9用户口碑监测", freq: "每 1 小时", window: "全天", lastRun: "14:00", enabled: true },
  { id: "3", project: "长安CS75Plus品牌传播监测", freq: "每 30 分钟", window: "09:00 — 21:00", lastRun: "14:30", enabled: true },
  { id: "4", project: "蔚来ET9上市传播监测", freq: "每 4 小时", window: "全天", lastRun: "12:00", enabled: true },
  { id: "5", project: "问界M9竞品舆情监测", freq: "—", window: "—", lastRun: "—", enabled: false },
];

export function RefreshMgmtPage() {
  return (
    <>
      <SectionTitle
        title="互动量刷新管理"
        action={
          <div className="flex items-center gap-2">
            <Button leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>额度预警设置</Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>新增刷新规则</Button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="今日刷新次数" value="284" icon={RefreshCw} tone="info" trend="up" trendValue="12.6%" trendLabel="vs 昨日" />
        <KpiCard label="今日消耗豆豆" value="1,240" icon={Coins} tone="teal" trend="ok" trendLabel="占总额度 6.2%" />
        <KpiCard label="自动刷新项目" value="4" icon={Zap} tone="purple" trend="ok" trendLabel="运行中" />
        <KpiCard label="剩余额度" value="12,580" icon={Database} tone="success" trend="ok" trendLabel="预计可用 12 天" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1.2fr_0.8fr_0.6fr_1fr] body12-cn-medium text-muted-foreground bg-[var(--input-background)] px-4 h-10 items-center">
          <span>项目名称</span>
          <span>刷新频率</span>
          <span>刷新时段</span>
          <span>最近刷新</span>
          <span>状态</span>
          <span className="text-right">操作</span>
        </div>
        {rules.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[2fr_1fr_1.2fr_0.8fr_0.6fr_1fr] px-4 h-12 items-center border-t border-border body12-cn-regular"
          >
            <div className="flex items-center gap-2 text-foreground">
              <StatusDot tone={r.enabled ? "success" : "neutral"} />
              <span className="truncate">{r.project}</span>
            </div>
            <span className="text-foreground">{r.freq}</span>
            <span className="text-muted-foreground">{r.window}</span>
            <span className="text-muted-foreground">{r.lastRun}</span>
            <Badge tone={r.enabled ? "success" : "neutral"}>
              {r.enabled ? "运行中" : "已暂停"}
            </Badge>
            <div className="flex items-center gap-1 justify-end">
              <Button size="sm" leftIcon={<Edit3 className="w-3 h-3" />}>规则</Button>
              <Button size="sm">{r.enabled ? "暂停" : "启用"}</Button>
            </div>
          </div>
        ))}
      </Card>

      <Pagination total={rules.length} current={1} pageCount={1} />
    </>
  );
}

/* ============================ 分类设置 ============================ */
type CategoryNode = { name: string; count: number; sub?: CategoryNode[] };

const categories: Record<string, CategoryNode[]> = {
  brand: [
    { name: "吉利", count: 8, sub: [{ name: "星越", count: 3 }, { name: "缤越", count: 2 }, { name: "博越", count: 3 }] },
    { name: "理想", count: 5, sub: [{ name: "L9", count: 2 }, { name: "L8", count: 2 }, { name: "L7", count: 1 }] },
    { name: "蔚来", count: 6, sub: [{ name: "ET9", count: 2 }, { name: "ET7", count: 2 }, { name: "ES8", count: 2 }] },
    { name: "长安", count: 7, sub: [{ name: "CS75Plus", count: 3 }, { name: "UNI-T", count: 2 }, { name: "深蓝 SL03", count: 2 }] },
  ],
  model: [
    { name: "SUV", count: 18 },
    { name: "轿车", count: 9 },
    { name: "MPV", count: 4 },
    { name: "新能源", count: 12 },
  ],
  tag: [
    { name: "新车上市", count: 6 },
    { name: "竞品对标", count: 4 },
    { name: "用户口碑", count: 9 },
    { name: "渠道拓展", count: 3 },
    { name: "危机公关", count: 2 },
  ],
};

const catTabs = [
  { key: "brand", label: "品牌 / 车型", count: 26 },
  { key: "model", label: "车型分类", count: 4 },
  { key: "tag", label: "自定义标签", count: 5 },
];

import { useState } from "react";

export function CategoryConfigPage() {
  const [tab, setTab] = useState("brand");
  const nodes = categories[tab] ?? [];

  return (
    <>
      <SectionTitle
        title="分类设置"
        action={
          <div className="flex items-center gap-2">
            <Button leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>同步标签</Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>新增分类</Button>
          </div>
        }
      />

      <Tabs items={catTabs} value={tab} onChange={setTab} />

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <SearchInput placeholder="搜索分类名称" className="flex-1 max-w-[320px]" />
          <Button rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>排序：使用频次</Button>
          <div className="flex-1" />
          <span className="body12-cn-regular text-muted-foreground">
            共 {nodes.length} 项分类
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {nodes.map((n) => (
            <div
              key={n.name}
              className="rounded-md border border-border p-3 bg-[var(--input-background)]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="h2-cn-medium text-foreground">{n.name}</span>
                  <Badge tone="neutral">{n.count} 关联项目</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton className="w-7 h-7">
                    <Edit3 className="w-3.5 h-3.5" />
                  </IconButton>
                  <IconButton className="w-7 h-7">
                    <Trash2 className="w-3.5 h-3.5" />
                  </IconButton>
                </div>
              </div>
              {n.sub && (
                <div className="flex flex-wrap gap-1.5">
                  {n.sub.map((s) => (
                    <span
                      key={s.name}
                      className="body12-cn-regular px-2 py-0.5 rounded bg-white border border-border text-foreground"
                    >
                      {s.name}
                      <span className="text-muted-foreground ml-1">{s.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
