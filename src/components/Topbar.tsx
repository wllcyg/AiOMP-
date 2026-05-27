import { Bell, ChevronRight, HelpCircle, RefreshCw } from "lucide-react";
import { IconButton, SearchInput } from "./ui";

export function Topbar({ breadcrumb }: { breadcrumb: string[] }) {
  return (
    <header className="h-14 border-b border-border px-6 flex items-center justify-between shrink-0 bg-[#fafbfc]">
      <div className="flex items-center gap-2 body12-cn-regular text-muted-foreground">
        {breadcrumb.map((b, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
            <span className={i === 0 ? "text-foreground" : ""}>{b}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <SearchInput placeholder="全局搜索..." className="w-64" />
        <IconButton>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </IconButton>
        <IconButton>
          <RefreshCw className="w-4 h-4" />
        </IconButton>
        <IconButton>
          <HelpCircle className="w-4 h-4" />
        </IconButton>
      </div>
    </header>
  );
}
