import { useState } from "react";
import {
  FileBarChart2,
  FolderKanban,
  UserCog,
} from "lucide-react";
import { Sidebar, Topbar, type SidebarGroup } from "../components";
import { MonitorListPage } from "./MonitorListPage";
import { MonitorDetailPage } from "./MonitorDetailPage";
import { ReportsPage } from "./ReportsPage";
import { TemplatesPage } from "./TemplatesPage";
import { TemplateEditorPage, type TemplateType } from "./TemplateEditorPage";
import {
  AccountPage,
  RefreshLogPage,
  RefreshMgmtPage,
  CategoryConfigPage,
} from "./SystemPages";

type PageKey = "list" | "detail" | "overview" | "reports" | "templates" | "templateEditor" | "account" | "log" | "refresh" | "tag";

const navGroups: SidebarGroup[] = [
  {
    key: "monitor",
    icon: FolderKanban,
    label: "监测模块",
    items: [{ key: "list", label: "监测项目列表", badge: 24 }],
  },
  {
    key: "report",
    icon: FileBarChart2,
    label: "智能报告",
    items: [
      { key: "reports", label: "报告管理" },
      { key: "templates", label: "报告模板中心" },
    ],
  },
  {
    key: "system",
    icon: UserCog,
    label: "系统管理",
    items: [
      { key: "account", label: "账号管理" },
      { key: "log", label: "刷新记录日志" },
      { key: "refresh", label: "互动量刷新管理" },
      { key: "tag", label: "分类设置" },
    ],
  },
];

export default function App() {
  const [page, setPage] = useState<PageKey>("list");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("3");
  const [templateType, setTemplateType] = useState<TemplateType>("special");

  const openTemplateEditor = (type: TemplateType) => {
    setTemplateType(type);
    setPage("templateEditor");
  };

  const openProject = (id: string) => {
    setSelectedProjectId(id);
    setPage("detail");
  };

  const pageMeta: Record<PageKey, { breadcrumb: string[]; render: () => React.ReactNode }> = {
    list: {
      breadcrumb: ["监测模块", "监测项目列表"],
      render: () => <MonitorListPage onOpenProject={openProject} />,
    },
    detail: {
      breadcrumb: ["监测模块", "监测项目列表", "监测数据详情"],
      render: () => (
        <MonitorDetailPage projectId={selectedProjectId} onBack={() => setPage("list")} />
      ),
    },
    overview: { breadcrumb: ["监测模块", "项目数据概览"], render: () => <Placeholder title="项目数据概览" /> },
    reports: { breadcrumb: ["智能报告", "报告管理"], render: () => <ReportsPage /> },
    templates: {
      breadcrumb: ["智能报告", "报告模板中心"],
      render: () => (
        <TemplatesPage
          onBack={() => setPage("reports")}
          onNewTemplate={openTemplateEditor}
        />
      ),
    },
    templateEditor: {
      breadcrumb: ["智能报告", "报告模板中心", "模板编辑器"],
      render: () => (
        <TemplateEditorPage
          templateType={templateType}
          onBack={() => setPage("templates")}
        />
      ),
    },
    account: { breadcrumb: ["系统管理", "账号管理"], render: () => <AccountPage /> },
    log: { breadcrumb: ["系统管理", "刷新记录日志"], render: () => <RefreshLogPage /> },
    refresh: { breadcrumb: ["系统管理", "互动量刷新管理"], render: () => <RefreshMgmtPage /> },
    tag: { breadcrumb: ["系统管理", "分类设置"], render: () => <CategoryConfigPage /> },
  };

  const meta = pageMeta[page];

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      <Sidebar
        groups={navGroups}
        activeKey={
          page === "detail" ? "list" : page === "templateEditor" ? "templates" : page
        }
        onItemClick={(key) => setPage(key as PageKey)}
        brand={{ initial: "传", title: "传播洞察", subtitle: "Brand Insight" }}
        user={{
          initial: "张",
          name: "张三丰",
          role: "超级管理员",
          quotaLabel: "洞察豆",
          quota: "12,580",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar breadcrumb={meta.breadcrumb} />
        <main
          className={
            page === "templateEditor"
              ? "flex-1 overflow-hidden p-6 bg-[#fafbfc]"
              : "flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafbfc]"
          }
        >
          {meta.render()}
        </main>
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-2">
      <div className="text-[15px] text-foreground">{title}</div>
      <div className="body12-cn-regular">该模块开发中…</div>
    </div>
  );
}
