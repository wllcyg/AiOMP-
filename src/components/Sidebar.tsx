import { useEffect, useState } from "react";
import { ChevronRight, Coins } from "lucide-react";
import { cn } from "./ui";

export type SidebarItem = { key: string; label: string; badge?: number };
export type SidebarGroup = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: SidebarItem[];
};

export function Sidebar({
  groups,
  activeKey,
  brand,
  user,
  onItemClick,
}: {
  groups: SidebarGroup[];
  activeKey: string;
  brand: { initial: string; title: string; subtitle: string };
  user: { initial: string; name: string; role: string; quotaLabel: string; quota: string };
  onItemClick?: (key: string) => void;
}) {
  const initialOpen = Object.fromEntries(
    groups.map((g) => [g.key, g.items.some((i) => i.key === activeKey)]),
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen);
  useEffect(() => {
    const groupOfActive = groups.find((g) => g.items.some((i) => i.key === activeKey));
    if (groupOfActive) {
      setOpenGroups((s) => ({ ...s, [groupOfActive.key]: true }));
    }
  }, [activeKey, groups]);
  const toggle = (key: string) =>
    setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  return (
    <aside className="w-[200px] shrink-0 text-sidebar-foreground border-r border-sidebar-border flex flex-col bg-[#f5f7f9]">
      <div className="h-14 px-4 flex items-center gap-2 border-b border-sidebar-border bg-[#f5f7f9]">
        <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[13px]">
          {brand.initial}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="h2-cn-medium text-foreground">{brand.title}</span>
          <span className="body10-cn-regular text-[var(--sidebar-muted)]">
            {brand.subtitle}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 bg-[#f5f7f9]">
        {groups.map((group) => {
          const Icon = group.icon;
          const open = openGroups[group.key];
          const hasActive = group.items.some((i) => i.key === activeKey);
          return (
            <div key={group.key} className="px-2">
              <button
                onClick={() => toggle(group.key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 h-10 rounded-md body12-cn-regular transition-colors",
                  hasActive ? "text-foreground" : "text-sidebar-foreground hover:bg-muted",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronRight
                  className={cn(
                    "w-3.5 h-3.5 text-[var(--sidebar-muted)] transition-transform",
                    open && "rotate-90",
                  )}
                />
              </button>
              {open && (
                <ul className="flex flex-col py-0.5 mb-1">
                  {group.items.map((item) => {
                    const active = item.key === activeKey;
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => onItemClick?.(item.key)}
                          className={cn(
                            "w-full flex items-center gap-2 pl-9 pr-3 h-9 rounded-md body12-cn-regular transition-colors relative",
                            active
                              ? "bg-white text-sidebar-accent-foreground"
                              : "bg-white/0 text-sidebar-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {active && (
                            <span className="absolute left-3 w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                          <span className="flex-1 text-left text-black">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "body10-cn-medium px-1.5 py-0.5 rounded-sm leading-none",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="m-2 p-3 rounded-lg border border-primary/10 bg-white">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center body12-cn-medium">
            {user.initial}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="h2-cn-medium text-foreground">{user.name}</span>
            <span className="body10-cn-regular text-muted-foreground">{user.role}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-primary/10">
          <span className="flex items-center gap-1 body10-cn-regular text-muted-foreground">
            <Coins className="w-3 h-3" />
            {user.quotaLabel}
          </span>
          <span className="body12-cn-medium text-primary">{user.quota}</span>
        </div>
      </div>
    </aside>
  );
}
