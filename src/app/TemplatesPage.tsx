import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Car,
  ChevronDown,
  FileText,
  Filter,
  Flame,
  Heart,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Scissors,
  Star,
  TrendingUp,
} from "lucide-react";
import type { TemplateType } from "./TemplateEditorPage";
import {
  Button,
  Card,
  FilterSelect,
  IconButton,
  Pagination,
  SearchInput,
  SectionTitle,
  TemplateCard,
  Tabs,
  cn,
  type Template,
} from "../components";

const templates: Template[] = [
  {
    id: "1",
    name: "品牌传播周报标准模板",
    subtitle: "品牌传播周报",
    type: "周期报告模板",
    status: "已发布",
    owner: "李四",
    category: "系统预置",
    version: "v3.2",
    cover: { icon: BarChart3, tone: "green" },
  },
  {
    id: "2",
    name: "新车上市全周期复盘模板",
    subtitle: "新车上市复盘",
    type: "专项报告模板",
    status: "已发布",
    owner: "李四",
    category: "系统预置",
    version: "v2.1",
    cover: { icon: Car, tone: "red" },
  },
  {
    id: "3",
    name: "竞品对标分析标准模板",
    subtitle: "竞品对标",
    type: "专项报告模板",
    status: "已发布",
    owner: "张三",
    category: "系统预置",
    version: "v2.0",
    cover: { icon: Scissors, tone: "purple" },
  },
  {
    id: "4",
    name: "负面舆情应急分析模板",
    subtitle: "危机舆情应对",
    type: "专项报告模板",
    status: "已发布",
    owner: "张三",
    category: "系统预置",
    version: "v1.5",
    cover: { icon: Flame, tone: "orange" },
  },
  {
    id: "5",
    name: "月度品牌健康度评估模板",
    subtitle: "品牌健康度评估",
    type: "周期报告模板",
    status: "已发布",
    owner: "王五",
    category: "系统预置",
    version: "v1.2",
    cover: { icon: Heart, tone: "pink" },
    favorite: true,
  },
  {
    id: "6",
    name: "KOL投放效果评估模板",
    subtitle: "KOL投放报告",
    type: "专项报告模板",
    status: "草稿箱",
    owner: "张三",
    category: "我的模板",
    version: "v0.3",
    cover: { icon: Star, tone: "orange" },
  },
  {
    id: "7",
    name: "热点事件监测分析模板",
    subtitle: "热点事件监测",
    type: "专项报告模板",
    status: "已发布",
    owner: "李四",
    category: "部门模板",
    version: "v1.0",
    cover: { icon: Flame, tone: "red" },
  },
  {
    id: "8",
    name: "Q1季度传播总结模板",
    subtitle: "季度总结",
    type: "周期报告模板",
    status: "已归档",
    owner: "王五",
    category: "全公司模板",
    version: "v1.3",
    cover: { icon: Calendar, tone: "blue" },
  },
  {
    id: "9",
    name: "汽车行业热点周报模板",
    subtitle: "行业热点周报",
    type: "周期报告模板",
    status: "已归档",
    owner: "李四",
    category: "系统预置",
    version: "v1.1",
    cover: { icon: Car, tone: "red" },
  },
  {
    id: "10",
    name: "企业传播分析月月报模板",
    subtitle: "月度报告",
    type: "周期报告模板",
    status: "已发布",
    owner: "王五",
    category: "系统预置",
    version: "v1.0",
    cover: { icon: TrendingUp, tone: "teal" },
  },
];

const tabs = [
  { key: "all", label: "全部", count: 10 },
  { key: "mine", label: "我的模板", count: 4 },
  { key: "dept", label: "部门模板", count: 2 },
  { key: "company", label: "全公司模板", count: 1 },
  { key: "system", label: "系统预置", count: 6 },
  { key: "draft", label: "草稿箱", count: 1 },
  { key: "archived", label: "已归档", count: 2 },
];

export function TemplatesPage({
  onBack,
  onNewTemplate,
}: {
  onBack?: () => void;
  onNewTemplate?: (type: TemplateType) => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <SectionTitle
        title="报告模板管理中心"
        action={
          <div className="flex items-center gap-2">
            <Button onClick={onBack} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              返回报告管理
            </Button>
            <div className="flex items-center rounded-md border border-border overflow-hidden">
              <IconButton
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-none w-8 h-8",
                  view === "grid" && "bg-white text-primary",
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
            <Button leftIcon={<Star className="w-3.5 h-3.5" />}>我的收藏</Button>
            <SearchInput placeholder="搜索模板名称、创建人" className="w-56" />
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                rightIcon={<ChevronDown className="w-3.5 h-3.5" />}
                onClick={() => setDropdownOpen((o) => !o)}
              >
                新建模板
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] z-50 w-48 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 body12-cn-regular text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      onNewTemplate?.("special");
                    }}
                  >
                    <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    新建专项报告模版
                  </button>
                  <div className="mx-4 h-px bg-border" />
                  <button
                    className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 body12-cn-regular text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      onNewTemplate?.("periodic");
                    }}
                  >
                    <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    新建周期模版
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterSelect label="模板类型" value="全部" />
          <FilterSelect label="模板状态" value="全部" />
          <FilterSelect label="部门" value="全部" />
          <FilterSelect label="适用场景" value="全部" />
          <FilterSelect label="创建时间" value="全部" />
          <Button variant="primary" leftIcon={<Filter className="w-3.5 h-3.5" />}>
            筛选
          </Button>
          <Button leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>重置</Button>
        </div>
      </Card>

      <Tabs items={tabs} value="all" />

      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4"
            : "flex flex-col gap-3",
        )}
      >
        {templates.map((t) => (
          <TemplateCard key={t.id} t={t} />
        ))}
      </div>

      <Pagination total={templates.length} current={1} pageCount={1} />
    </>
  );
}
