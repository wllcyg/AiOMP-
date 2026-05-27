import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  GripVertical,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Upload,
} from "lucide-react";
import { cn, Button } from "../components";

export type TemplateType = "special" | "periodic";

interface Props {
  templateType?: TemplateType;
  onBack?: () => void;
}

// ─── Component library items ───────────────────────────────────────────────

type ComponentId =
  | "title"
  | "richtext"
  | "paged"
  | "imgtext"
  | "imglist"
  | "kpi_std"
  | "kpi_cmp"
  | "kpi_trend"
  | "kpi_vol"
  | "kpi_ratio"
  | "kpi_rank"
  | "chart_bar"
  | "chart_bubble"
  | "chart_pie"
  | "chart_radar";

interface ComponentItem {
  id: ComponentId;
  label: string;
  desc: string;
  badgeColor: string;
  badgeText: string;
  badgeBg: string;
}

const basicLayoutItems: ComponentItem[] = [
  {
    id: "title",
    label: "标题文本框",
    desc: "报告头、标题、章节标题",
    badgeBg: "#FEF3F2",
    badgeColor: "#D54941",
    badgeText: "标",
  },
  {
    id: "richtext",
    label: "正文文本框",
    desc: "正文富文本、品牌文字描述",
    badgeBg: "#FEF3F2",
    badgeColor: "#D54941",
    badgeText: "文",
  },
  {
    id: "paged",
    label: "段落分页文本框",
    desc: "图文分页多字段文字组",
    badgeBg: "#FEF3F2",
    badgeColor: "#D54941",
    badgeText: "段",
  },
  {
    id: "imgtext",
    label: "段落文字+内容区域",
    desc: "图文合页多字段文字组",
    badgeBg: "#FEF3F2",
    badgeColor: "#D54941",
    badgeText: "区",
  },
  {
    id: "imglist",
    label: "图文列表内容",
    desc: "多条图文并排列表展示",
    badgeBg: "#E8F7EE",
    badgeColor: "#1D8348",
    badgeText: "图",
  },
];

const kpiItems: ComponentItem[] = [
  { id: "kpi_std", label: "标准KPI卡片", desc: "单值指标展示", badgeBg: "#EBF5FB", badgeColor: "#1A5276", badgeText: "K" },
  { id: "kpi_cmp", label: "对比KPI卡片", desc: "环比/同比对比", badgeBg: "#EBF5FB", badgeColor: "#1A5276", badgeText: "K" },
  { id: "kpi_trend", label: "趋势卡片", desc: "折线趋势小图表", badgeBg: "#EBF5FB", badgeColor: "#1A5276", badgeText: "K" },
  { id: "kpi_vol", label: "声量卡片", desc: "声量数值展示", badgeBg: "#EBF5FB", badgeColor: "#1A5276", badgeText: "K" },
  { id: "kpi_ratio", label: "占比卡片", desc: "比例饼图卡", badgeBg: "#EBF5FB", badgeColor: "#1A5276", badgeText: "K" },
  { id: "kpi_rank", label: "排行卡片", desc: "榜单排行展示", badgeBg: "#EBF5FB", badgeColor: "#1A5276", badgeText: "K" },
];

const chartGroups = [
  { id: "chart_group", label: "常用业务图表组", count: 7 },
  { id: "bubble", label: "气泡图组", count: 5 },
  { id: "bar_group", label: "柱图组", count: 6 },
  { id: "pie", label: "饼图组", count: 4 },
];

// ─── Data fields ───────────────────────────────────────────────────────────

const dataFields = [
  { type: "数值", typeBg: "#FFF7E6", typeColor: "#D46B08", label: "传播声量" },
  { type: "数值", typeBg: "#FFF7E6", typeColor: "#D46B08", label: "互动量" },
  { type: "数值", typeBg: "#FFF7E6", typeColor: "#D46B08", label: "点赞数" },
  { type: "数值", typeBg: "#FFF7E6", typeColor: "#D46B08", label: "评论数" },
  { type: "数值", typeBg: "#FFF7E6", typeColor: "#D46B08", label: "转发数" },
  { type: "数值", typeBg: "#FFF7E6", typeColor: "#D46B08", label: "阅读量" },
  { type: "百分比", typeBg: "#F0FFF4", typeColor: "#1D8348", label: "正面率" },
  { type: "百分比", typeBg: "#F0FFF4", typeColor: "#1D8348", label: "负面率" },
  { type: "维度", typeBg: "#F3E8FF", typeColor: "#6B21A8", label: "媒体平台" },
  { type: "时间", typeBg: "#EBF5FB", typeColor: "#1A5276", label: "发布时间" },
  { type: "维度", typeBg: "#F3E8FF", typeColor: "#6B21A8", label: "作者/账号" },
  { type: "维度", typeBg: "#F3E8FF", typeColor: "#6B21A8", label: "地区" },
  { type: "维度", typeBg: "#F3E8FF", typeColor: "#6B21A8", label: "情感倾向" },
  { type: "维度", typeBg: "#F3E8FF", typeColor: "#6B21A8", label: "内容类型" },
];

const dataTags = [
  { label: "新能源", count: "13.1k" },
  { label: "自动驾驶", count: "6.8k" },
  { label: "品牌形象", count: "7.9k" },
  { label: "产品口碑", count: "9.3k" },
  { label: "外竞争力", count: null },
  { label: "外观设计", count: null },
  { label: "智能配置", count: "4.4k" },
  { label: "安全性能", count: "3.8k" },
  { label: "售后服务", count: "3.4k" },
  { label: "节油性能", count: "2.7k" },
  { label: "充电便利性", count: "2.0k" },
];

// ─── Per-component config panels ──────────────────────────────────────────

function FontControls({ showIndent = false }: { showIndent?: boolean }) {
  const [align, setAlign] = useState<"left" | "center" | "right" | "justify">("left");
  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <span
          className="w-3 h-3 rounded-sm flex-shrink-0"
          style={{ background: "#D54941" }}
        />
        <span className="body12-cn-medium text-foreground">字体排版</span>
      </div>
      <div className="flex gap-1.5 mb-2">
        <select className="flex-1 h-7 px-2 rounded border border-border body11-cn-regular text-foreground bg-white appearance-none text-[11px]">
          <option>微软雅黑</option>
          <option>宋体</option>
          <option>黑体</option>
        </select>
        <select className="w-[56px] h-7 px-1 rounded border border-border body11-cn-regular text-foreground bg-white appearance-none text-[11px]">
          <option>14px</option>
          <option>12px</option>
          <option>16px</option>
          <option>18px</option>
          <option>20px</option>
        </select>
      </div>
      <div className="flex gap-1 mb-2">
        {(showIndent
          ? (["left", "center", "right", "justify"] as const)
          : (["left", "center", "right"] as const)
        ).map((a) => (
          <button
            key={a}
            onClick={() => setAlign(a)}
            className={cn(
              "flex-1 h-7 rounded border text-[11px] transition-colors",
              align === a
                ? "border-[#D54941] bg-[#FEF3F2] text-[#D54941]"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {a === "left" ? "左" : a === "center" ? "中" : a === "right" ? "右" : "两端"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px] text-muted-foreground">字色</span>
        {["#1A1A1A", "#D54941", "#86909C"].map((c) => (
          <button
            key={c}
            className="w-5 h-5 rounded-sm border border-border flex-shrink-0"
            style={{ background: c }}
          />
        ))}
        <input
          defaultValue="#1A1A1A"
          className="flex-1 h-6 px-1.5 rounded border border-border body11-cn-regular text-foreground text-[11px] min-w-0"
        />
      </div>
      {showIndent && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-foreground whitespace-nowrap">首行缩进</span>
          <select className="flex-1 h-7 px-2 rounded border border-border text-[11px] bg-white appearance-none">
            <option>2字符</option>
            <option>0字符</option>
            <option>4字符</option>
          </select>
        </div>
      )}
    </div>
  );
}

function TitleConfig() {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "#FEF3F2", color: "#D54941" }}>标</span>
        <span className="body12-cn-medium text-foreground">标题卡片</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">标题文本</label>
        <input
          defaultValue="品牌传播周报"
          className="w-full h-7 px-2 rounded border border-border body12-cn-regular text-foreground text-[12px] focus:outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">标题级别</label>
        <select defaultValue="H2" className="w-full h-7 px-2 rounded border border-border text-[12px] bg-white appearance-none">
          <option value="H1">H1 一级标题 (24px)</option>
          <option value="H2">H2 二级标题 (20px)</option>
          <option value="H3">H3 三级标题 (16px)</option>
          <option value="H4">H4 四级标题 (14px)</option>
        </select>
      </div>
      <div className="border-t border-border pt-2">
        <FontControls />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-foreground">显示底部边框</span>
        <button className="w-9 h-5 rounded-full bg-[#D54941] relative flex-shrink-0">
          <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
        </button>
      </div>
    </div>
  );
}

function RichTextConfig() {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "#FEF3F2", color: "#D54941" }}>文</span>
        <span className="body12-cn-medium text-foreground">正文文本框</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">正文内容需求描述</label>
        <textarea
          className="w-full rounded border border-border body12-cn-regular text-foreground text-[12px] p-2 focus:outline-none focus:border-primary resize-none leading-relaxed"
          rows={4}
          placeholder="描述这部分正文要写什么内容，例如：分析本周声量趋势，重点说明峰值原因，给出下周建议..."
        />
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">参考数据选择</label>
        <p className="text-[10px] text-muted-foreground mb-1.5">选择画布中已添加的图表，AI将读取这些图表生成文字</p>
        <div className="flex gap-1.5">
          <select className="flex-1 h-7 px-2 rounded border border-border text-[11px] bg-white appearance-none min-w-0 text-muted-foreground">
            <option>-- 选择画布中的图表 --</option>
          </select>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted transition-colors flex-shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="border-t border-border pt-2">
        <FontControls showIndent />
      </div>
    </div>
  );
}

function PagedTextConfig() {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "#FEF3F2", color: "#D54941" }}>段</span>
        <span className="body12-cn-medium text-foreground">段落分页文本框</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">每页显示字段数</label>
        <select className="w-full h-7 px-2 rounded border border-border text-[12px] bg-white appearance-none">
          <option>5 条</option>
          <option>10 条</option>
          <option>20 条</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">字段拖入区</label>
        <div className="border border-dashed border-border rounded p-3 text-center text-[11px] text-muted-foreground">
          从右侧数据字段拖入
        </div>
      </div>
      <div className="border-t border-border pt-2">
        <FontControls showIndent />
      </div>
    </div>
  );
}

function ImgTextConfig() {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "#FEF3F2", color: "#D54941" }}>区</span>
        <span className="body12-cn-medium text-foreground">段落文字+内容区域</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">布局方式</label>
        <div className="grid grid-cols-2 gap-1.5">
          {["左文右图", "左图右文", "上文下图", "上图下文"].map((l) => (
            <button
              key={l}
              className={cn(
                "h-7 rounded border text-[11px] transition-colors",
                l === "左文右图"
                  ? "border-[#D54941] bg-[#FEF3F2] text-[#D54941]"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">内容区域</label>
        <div className="border border-dashed border-border rounded p-3 text-center text-[11px] text-muted-foreground">
          拖入图表或图片
        </div>
      </div>
      <div className="border-t border-border pt-2">
        <FontControls />
      </div>
    </div>
  );
}

function ImgListConfig() {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "#E8F7EE", color: "#1D8348" }}>图</span>
        <span className="body12-cn-medium text-foreground">图文列表内容</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">每行列数</label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={cn(
                "flex-1 h-7 rounded border text-[11px] transition-colors",
                n === 2
                  ? "border-[#D54941] bg-[#FEF3F2] text-[#D54941]"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">图片比例</label>
        <select className="w-full h-7 px-2 rounded border border-border text-[12px] bg-white appearance-none">
          <option>16:9</option>
          <option>1:1</option>
          <option>4:3</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">字段拖入区</label>
        <div className="border border-dashed border-border rounded p-3 text-center text-[11px] text-muted-foreground">
          从右侧数据字段拖入
        </div>
      </div>
      <div className="border-t border-border pt-2">
        <FontControls />
      </div>
    </div>
  );
}

function KpiConfig({ item }: { item: ComponentItem }) {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
          style={{ background: item.badgeBg, color: item.badgeColor }}
        >
          {item.badgeText}
        </span>
        <span className="body12-cn-medium text-foreground">{item.label}</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">数值字段</label>
        <div className="border border-dashed border-border rounded p-2.5 text-center text-[11px] text-muted-foreground">
          从右侧拖入数值字段
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">指标标签</label>
        <input
          className="w-full h-7 px-2 rounded border border-border text-[12px] focus:outline-none focus:border-primary"
          placeholder="如：总声量"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-foreground">显示环比</span>
        <button className="w-9 h-5 rounded-full bg-[#86909c] relative flex-shrink-0">
          <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-foreground">显示趋势线</span>
        <button className="w-9 h-5 rounded-full bg-[#D54941] relative flex-shrink-0">
          <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
        </button>
      </div>
    </div>
  );
}

function DefaultConfig({ item }: { item: ComponentItem }) {
  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
          style={{ background: item.badgeBg, color: item.badgeColor }}
        >
          {item.badgeText}
        </span>
        <span className="body12-cn-medium text-foreground">{item.label}</span>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">数据字段绑定</label>
        <div className="border border-dashed border-border rounded p-3 text-center text-[11px] text-muted-foreground">
          从右侧数据字段拖入
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-muted-foreground mb-1">配色方案</label>
        <div className="flex gap-1.5">
          {["#D54941", "#1A5276", "#1D8348", "#D46B08"].map((c) => (
            <button
              key={c}
              className="flex-1 h-7 rounded border-2 border-transparent hover:border-border transition-colors"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComponentConfigPanel({ selectedId }: { selectedId: ComponentId | null }) {
  if (!selectedId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <span className="body12-cn-regular text-muted-foreground text-center">
          请在组件库中点击组件以编辑配置
        </span>
      </div>
    );
  }
  if (selectedId === "title") return <TitleConfig />;
  if (selectedId === "richtext") return <RichTextConfig />;
  if (selectedId === "paged") return <PagedTextConfig />;
  if (selectedId === "imgtext") return <ImgTextConfig />;
  if (selectedId === "imglist") return <ImgListConfig />;
  const kpi = kpiItems.find((k) => k.id === selectedId);
  if (kpi) return <KpiConfig item={kpi} />;
  const any = [...basicLayoutItems, ...kpiItems].find((i) => i.id === selectedId);
  if (any) return <DefaultConfig item={any} />;
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <span className="body12-cn-regular text-muted-foreground">暂无配置</span>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export function TemplateEditorPage({ templateType = "special", onBack }: Props) {
  const [zoom, setZoom] = useState(100);
  const [rightTab, setRightTab] = useState<"components" | "config">("components");
  const [dataTab, setDataTab] = useState<"fields" | "tags" | "monitor">("fields");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["basic"]));
  const [selectedComponent, setSelectedComponent] = useState<ComponentId | null>(null);

  const templateName =
    templateType === "special" ? "新建品牌传播模版" : "新建周期报告模版";

  function toggleGroup(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectComponent(id: ComponentId) {
    setSelectedComponent(id);
    setRightTab("config");
  }

  return (
    <div className="flex flex-col -m-6" style={{ height: "calc(100vh - 48px)" }}>
      {/* Secondary editor toolbar */}
      <div className="flex items-center justify-between px-4 h-11 bg-white border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 body12-cn-regular text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回
          </button>
          <span className="w-px h-4 bg-border" />
          <span className="body14-cn-medium text-foreground">{templateName}</span>
          <span className="bg-[#FEF3F2] text-[#D54941] body12-cn-regular px-2 py-0.5 rounded">
            草稿
          </span>
          <span className="w-px h-4 bg-border" />
          <span className="body12-cn-regular text-muted-foreground">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <Button>保存草稿</Button>
          <Button leftIcon={<Eye className="w-3.5 h-3.5" />}>预览</Button>
          <Button variant="primary">发布模板</Button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f7]">
          {/* Canvas toolbar */}
          <div className="flex items-center justify-between px-4 h-10 bg-white border-b border-border flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="body12-cn-regular text-foreground w-10 text-center">{zoom}%</span>
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
              >
                <Plus className="w-3 h-3" />
              </button>
              <span className="mx-2 w-px h-4 bg-border" />
              <button className="flex items-center gap-1 body12-cn-regular text-foreground hover:bg-muted px-2 h-7 rounded transition-colors">
                2列
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            <span className="body12-cn-regular text-muted-foreground">自由布局</span>
            <div className="flex items-center gap-4 body12-cn-regular text-muted-foreground">
              <span>A4纸尺寸</span>
              <span>页面 1/3</span>
            </div>
          </div>

          {/* Scrollable canvas */}
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
            <div
              className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded origin-top"
              style={{
                width: 595,
                minHeight: 842,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <div className="flex items-center justify-between px-8 pt-6 pb-3 border-b border-[#f0f0f0]">
                <span className="text-[11px] font-semibold text-[#D54941]">
                  品牌传播监测洞察平台
                </span>
                <span className="text-[10px] text-[#86909c]">
                  BRAND INSIGHT REPORT · 2026-04-07
                </span>
              </div>
              <div className="px-8 pt-5 pb-6 space-y-5">
                <h2 className="text-[17px] font-bold text-[#1d2129] leading-snug">
                  长安CS75Plus 品牌传播周报（2026年第14周）
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "总声量", value: "89,420", red: false },
                    { label: "正面AI比", value: "68%", red: true },
                    { label: "总互动量", value: "234.6万", red: true },
                    { label: "新增传播", value: "3,248", red: false },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="border border-[#eef0f3] rounded-lg p-3 text-center cursor-pointer hover:border-[#D54941] transition-colors"
                      onClick={() => selectComponent("kpi_std")}
                    >
                      <div className="text-[10px] text-[#86909c] mb-1">{kpi.label}</div>
                      <div
                        className={cn(
                          "text-[18px] font-bold",
                          kpi.red ? "text-[#D54941]" : "text-[#1d2129]",
                        )}
                      >
                        {kpi.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#1d2129] mb-2">总声量传播趋势图</div>
                  <div className="h-[120px] bg-[#fafbfc] border border-[#eef0f3] rounded-lg flex items-center justify-center">
                    <span className="text-[11px] text-[#86909c]">图表预览区（实际数据将自动填充）</span>
                  </div>
                </div>
                <div className="bg-[#FEF3F2] rounded-lg p-4 border-l-[3px] border-[#D54941]">
                  <div className="text-[11px] font-medium text-[#D54941] mb-2">AI智能分析</div>
                  <div className="text-[11px] text-[#1d2129] leading-[1.7]">
                    本周传播声量整体呈上升趋势，周三出现明显峰值，主要受益于「蓝鲸杯年度车型评选」话题引爆，建议从下周重点布局周二至周四内容投放...
                  </div>
                </div>
                <button className="w-full border border-dashed border-[#c9cdd4] rounded-lg h-14 flex items-center justify-center gap-2 text-[#86909c] text-[11px] hover:border-[#D54941] hover:text-[#D54941] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  点击此处从右侧组件库拖入新组件
                </button>
              </div>
              <div className="px-8 py-3 border-t border-[#f0f0f0] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#86909c]">
                  <span>数据源：</span>
                  <span>内容资库</span>
                </div>
                <span className="text-[10px] text-[#86909c]">第1页，共3页</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Component library / config */}
        <div className="w-[240px] flex-shrink-0 bg-white border-l border-border flex flex-col">
          {/* Tab row */}
          <div className="flex border-b border-border flex-shrink-0">
            {(
              [
                { key: "components" as const, label: "组件库" },
                { key: "config" as const, label: "组件配置" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRightTab(tab.key)}
                className={cn(
                  "flex-1 h-9 body12-cn-regular transition-colors relative",
                  rightTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {rightTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {rightTab === "components" ? (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Search */}
              <div className="p-3 border-b border-border flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    placeholder="搜索组件..."
                    className="w-full h-7 pl-8 pr-3 rounded-md bg-[#f4f5f7] body12-cn-regular text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* 基础排版组件 group */}
                <div>
                  <button
                    onClick={() => toggleGroup("basic")}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <span className="body12-cn-medium text-foreground">基础排版组件</span>
                    {expandedGroups.has("basic") ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedGroups.has("basic") && (
                    <div className="border-b border-border">
                      {basicLayoutItems.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer group transition-colors",
                            selectedComponent === item.id && "bg-[#FEF3F2]",
                          )}
                          onClick={() => selectComponent(item.id)}
                        >
                          <span
                            className="w-7 h-7 rounded flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                            style={{ background: item.badgeBg, color: item.badgeColor }}
                          >
                            {item.badgeText}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="body12-cn-medium text-foreground truncate">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{item.desc}</div>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* KPI / basic cards group */}
                <div>
                  <button
                    onClick={() => toggleGroup("kpi")}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="body12-cn-medium text-foreground">基础卡片组件</span>
                      <span className="text-[10px] text-muted-foreground">6</span>
                    </div>
                    {expandedGroups.has("kpi") ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedGroups.has("kpi") && (
                    <div className="border-b border-border">
                      {kpiItems.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer group transition-colors",
                            selectedComponent === item.id && "bg-[#EBF5FB]",
                          )}
                          onClick={() => selectComponent(item.id)}
                        >
                          <span
                            className="w-7 h-7 rounded flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                            style={{ background: item.badgeBg, color: item.badgeColor }}
                          >
                            {item.badgeText}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="body12-cn-medium text-foreground truncate">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{item.desc}</div>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chart groups */}
                {chartGroups.map((g) => (
                  <div key={g.id}>
                    <button
                      onClick={() => toggleGroup(g.id)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors border-b border-border"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="body12-cn-medium text-foreground">{g.label}</span>
                        <span className="text-[10px] text-muted-foreground">{g.count}</span>
                      </div>
                      {expandedGroups.has(g.id) ? (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ComponentConfigPanel selectedId={selectedComponent} />
            </div>
          )}
        </div>

        {/* Far-right panel: Data fields */}
        <div className="w-[210px] flex-shrink-0 bg-white border-l border-border flex flex-col">
          <div className="px-3 py-2.5 border-b border-border flex-shrink-0">
            <span className="body12-cn-medium text-foreground">数据及字段选择区</span>
          </div>

          {/* Tab row */}
          <div className="flex border-b border-border flex-shrink-0">
            {(
              [
                { key: "fields" as const, label: "数据字段" },
                { key: "tags" as const, label: "标签" },
                { key: "monitor" as const, label: "监测项" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDataTab(tab.key)}
                className={cn(
                  "flex-1 h-8 body10-cn-regular transition-colors relative",
                  dataTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {dataTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {dataTab === "fields" && (
              <div className="p-2.5 space-y-1.5">
                {/* Upload section */}
                <div className="border border-border rounded-lg px-2.5 py-2 mb-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Upload className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="text-[11px] font-medium text-foreground">上传数据表自动识别字段</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                    支持 .xlsx / .csv 格式，上传后自动识别列名为字段
                  </p>
                  <div className="flex gap-1.5">
                    <button className="flex-1 h-7 flex items-center justify-center gap-1 bg-primary text-primary-foreground rounded text-[11px]">
                      <Upload className="w-3 h-3" />
                      选择文件
                    </button>
                    <button className="flex-1 h-7 flex items-center justify-center gap-1 border border-border rounded text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                      <RotateCcw className="w-3 h-3" />
                      重置
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground px-1 pb-1">
                  拖动字段到右侧组件配置的拖入区，共 {dataFields.length} 个字段
                </p>

                {/* Field rows */}
                <div className="space-y-0.5">
                  {dataFields.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-1.5 py-1.5 px-1.5 rounded hover:bg-muted cursor-grab transition-colors group"
                    >
                      <span
                        className="text-[9px] font-medium px-1 py-0.5 rounded leading-none flex-shrink-0 whitespace-nowrap"
                        style={{ background: f.typeBg, color: f.typeColor }}
                      >
                        {f.type}
                      </span>
                      <span className="body12-cn-regular text-foreground flex-1 min-w-0 truncate text-[12px]">
                        {f.label}
                      </span>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dataTab === "tags" && (
              <div className="p-2.5 space-y-0.5">
                {dataTags.map((tag) => (
                  <div
                    key={tag.label}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-muted rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#FEF3F2] text-[#D54941] text-[10px] px-1 py-0.5 rounded leading-none">
                        标
                      </span>
                      <span className="body12-cn-regular text-foreground">{tag.label}</span>
                    </div>
                    {tag.count && (
                      <span className="body10-cn-regular text-muted-foreground">{tag.count}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {dataTab === "monitor" && (
              <div className="flex items-center justify-center p-8">
                <span className="body12-cn-regular text-muted-foreground text-center">
                  选择监测数据源
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
