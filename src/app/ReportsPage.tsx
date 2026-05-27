import { useState } from "react";
import { Filter, LayoutGrid, List, Plus, RotateCcw } from "lucide-react";
import {
  Button,
  Card,
  FilterSelect,
  IconButton,
  Pagination,
  ReportCard,
  SearchInput,
  SectionTitle,
  Tabs,
  cn,
  type Report,
} from "../components";

const reports: Report[] = [
  {
    id: "1",
    code: "RPT006",
    name: "KOL投放效果评估报告",
    subtitle: "KOL投放报告",
    type: "专项报告",
    status: "已发布",
    metrics: [
      { value: "9.0万", label: "覆盖量", tone: "default" },
      { value: "74%", label: "正面率", tone: "success" },
      { value: "4", label: "媒体覆盖", tone: "default" },
      { value: "1.8%", label: "负面率", tone: "warning" },
    ],
    owner: "张三",
    publishedAt: "2026-04-10 16:30",
  },
  {
    id: "2",
    code: "RPT005",
    name: "4月第2周竞品对标分析报告",
    subtitle: "竞品对标",
    type: "专项报告",
    status: "已发布",
    metrics: [
      { value: "7.6万", label: "覆盖量" },
      { value: "58%", label: "正面率", tone: "success" },
      { value: "4", label: "媒体覆盖" },
      { value: "8.1%", label: "负面率", tone: "destructive" },
    ],
    owner: "李四",
    publishedAt: "2026-04-08 20:10",
  },
  {
    id: "3",
    code: "RPT004",
    name: "长安CS75 3月品牌传播周报",
    subtitle: "长安CS75Plus 周期报告",
    type: "周期报告",
    status: "已发布",
    metrics: [
      { value: "15.8万", label: "覆盖量" },
      { value: "72%", label: "正面率", tone: "success" },
      { value: "6", label: "媒体覆盖" },
      { value: "3.2%", label: "负面率", tone: "warning" },
    ],
    owner: "张三",
    publishedAt: "2026-04-07 09:00",
  },
  {
    id: "4",
    code: "RPT003",
    name: "4月第1期问界品牌传播周报",
    subtitle: "问界品牌周报",
    type: "周期报告",
    status: "已发布",
    metrics: [
      { value: "14.3万", label: "覆盖量" },
      { value: "69%", label: "正面率", tone: "success" },
      { value: "8", label: "媒体覆盖" },
      { value: "4.5%", label: "负面率", tone: "warning" },
    ],
    owner: "李四",
    publishedAt: "2026-04-07 09:00",
  },
  {
    id: "5",
    code: "RPT002",
    name: "负面舆情应急分析报告",
    subtitle: "危机舆情应对",
    type: "专项报告",
    status: "已发布",
    metrics: [
      { value: "4.6万", label: "覆盖量" },
      { value: "23%", label: "正面率", tone: "warning" },
      { value: "3", label: "媒体覆盖" },
      { value: "72%", label: "负面率", tone: "destructive" },
    ],
    owner: "张三",
    publishedAt: "2026-04-05 22:45",
  },
  {
    id: "6",
    code: "RPT001",
    name: "蔚来ET9上市传播全周期复盘",
    subtitle: "新车上市报告",
    type: "专项报告",
    status: "已发布",
    metrics: [
      { value: "9.9万", label: "覆盖量" },
      { value: "78%", label: "正面率", tone: "success" },
      { value: "5", label: "媒体覆盖" },
      { value: "5.8%", label: "负面率", tone: "warning" },
    ],
    owner: "李四",
    publishedAt: "2026-04-04 17:30",
  },
  {
    id: "7",
    code: "RPT007",
    name: "理想L9 vs 蔚来ET9产品对比分析",
    subtitle: "产品对比研究",
    type: "专项报告",
    status: "草稿箱",
    metrics: [
      { value: "6.2万", label: "覆盖量" },
      { value: "60%", label: "正面率", tone: "success" },
      { value: "5", label: "媒体覆盖" },
      { value: "6.2%", label: "负面率", tone: "warning" },
    ],
    owner: "王五",
    publishedAt: "2026-04-02 10:00",
  },
  {
    id: "8",
    code: "RPT008",
    name: "Q1车型品牌健康度分析报告",
    subtitle: "品牌健康度",
    type: "专项报告",
    status: "已归档",
    metrics: [
      { value: "32.0万", label: "覆盖量" },
      { value: "65%", label: "正面率", tone: "success" },
      { value: "8", label: "媒体覆盖" },
      { value: "2.4%", label: "负面率", tone: "warning" },
    ],
    owner: "王五",
    publishedAt: "2026-04-07 14:00",
  },
];

const tabs = [
  { key: "all", label: "全部", count: 8 },
  { key: "special", label: "专项报告", count: 4 },
  { key: "periodic", label: "周期报告", count: 2 },
  { key: "draft", label: "草稿箱", count: 1 },
  { key: "archived", label: "已归档", count: 1 },
];

export function ReportsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      <SectionTitle
        title="报告管理"
        action={
          <div className="flex items-center gap-2">
            <Button>周报报告片列表</Button>
            <Button>模板中心</Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              新建报告
            </Button>
          </div>
        }
      />

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            placeholder="搜索报告名称..."
            className="flex-1 min-w-[240px] max-w-[320px]"
          />
          <FilterSelect label="状态" value="全部" />
          <FilterSelect label="类型" value="全部" />
          <FilterSelect label="任务" value="所有任务" />
          <Button variant="primary" leftIcon={<Filter className="w-3.5 h-3.5" />}>
            筛选
          </Button>
          <Button leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>重置</Button>
          <div className="flex-1" />
          <div className="flex items-center rounded-md border border-border overflow-hidden">
            <IconButton
              onClick={() => setView("grid")}
              className={cn(
                "rounded-none w-8 h-8",
                view === "grid" && "bg-[var(--brand-bg)] text-primary",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </IconButton>
            <IconButton
              onClick={() => setView("list")}
              className={cn(
                "rounded-none w-8 h-8 border-l border-border",
                view === "list" && "bg-[var(--brand-bg)] text-primary",
              )}
            >
              <List className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </Card>

      <Tabs items={tabs} value="all" />

      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-3",
        )}
      >
        {reports.map((r) => (
          <ReportCard key={r.id} r={r} />
        ))}
      </div>

      <Pagination total={reports.length} current={1} pageCount={1} />
    </>
  );
}
