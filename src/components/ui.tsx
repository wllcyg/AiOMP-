import * as React from "react";
import { ChevronDown, Search } from "lucide-react";

/* ----------------------------- utilities ----------------------------- */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------- Button ------------------------------ */
type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export function Button({
  variant = "secondary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md body12-cn-regular transition-colors disabled:opacity-50";
  const sizes: Record<ButtonSize, string> = {
    sm: "h-7 px-2.5",
    md: "h-8 px-3",
  };
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary:
      "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

/* ----------------------------- IconButton ---------------------------- */
export function IconButton({
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center relative transition-colors",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* -------------------------------- Card ------------------------------- */
export function Card({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg shadow-[0_1px_2px_rgba(15,23,42,0.04)] border border-transparent",
        className,
      )}
      {...rest}
    />
  );
}

/* ------------------------------- Badge ------------------------------- */
type BadgeTone = "success" | "warning" | "neutral" | "info" | "brand";
const badgeTones: Record<BadgeTone, string> = {
  success: "text-[#2ba471] bg-[var(--success-bg)]",
  warning: "text-[var(--warning)] bg-[var(--warning-bg)]",
  neutral: "text-[var(--neutral)] bg-[var(--neutral-bg)]",
  info: "text-[var(--info)] bg-[var(--info-bg)]",
  brand: "text-[#d54941] bg-[var(--brand-bg)]",
};
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn("body12-cn-regular px-2 py-0.5 rounded", badgeTones[tone], className)}
    >
      {children}
    </span>
  );
}

/* ------------------------------ StatusDot ---------------------------- */
const dotTones: Record<BadgeTone, string> = {
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  neutral: "bg-[var(--neutral)]",
  info: "bg-[var(--info)]",
  brand: "bg-[var(--destructive)]",
};
export function StatusDot({
  tone = "neutral",
  className,
}: {
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-block w-1.5 h-1.5 rounded-full", dotTones[tone], className)}
    />
  );
}

/* ------------------------------- Input ------------------------------- */
export function Input({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-8 px-3 rounded-md bg-input-background border border-transparent focus:border-primary/40 focus:outline-none body12-cn-regular text-foreground placeholder:text-muted-foreground",
        className,
      )}
      {...rest}
    />
  );
}

export function SearchInput({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
      <Input className="pl-9 pr-3 w-full" {...rest} />
    </div>
  );
}

/* --------------------------- FilterSelect ---------------------------- */
export function FilterSelect({
  label,
  value,
  onClick,
}: {
  label?: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 body12-cn-regular">
      {label && <span className="text-muted-foreground">{label}：</span>}
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 h-8 rounded-md border border-border bg-card text-foreground hover:border-primary/50 transition-colors min-w-[110px] justify-between"
      >
        <span>{value}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}

/* -------------------------------- Tabs ------------------------------- */
export type TabItem = { key: string; label: string; count?: number };

export function Tabs({
  items,
  value,
  onChange,
  right,
}: {
  items: TabItem[];
  value: string;
  onChange?: (key: string) => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end gap-1 border-b border-border w-full">
      {items.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            onClick={() => onChange?.(t.key)}
            className={cn(
              "relative h-9 px-4 body12-cn-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 body10-cn-regular px-1.5 py-0.5 rounded-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            )}
            {active && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
      <div className="flex-1" />
      {right && <div className="pb-2">{right}</div>}
    </div>
  );
}

/* ---------------------------- SectionTitle --------------------------- */
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-0.5 h-4 bg-primary rounded-full" />
        <h1 className="h1-cn-medium text-foreground">{title}</h1>
      </div>
      {action}
    </div>
  );
}

/* ----------------------------- Pagination ---------------------------- */
export function Pagination({
  total,
  current,
  pageCount,
  onChange,
}: {
  total: number;
  current: number;
  pageCount: number;
  onChange?: (page: number | "prev" | "next") => void;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between pt-2">
      <span className="body12-cn-regular text-muted-foreground">
        共 <span className="text-foreground">{total}</span> 个项目
      </span>
      <div className="flex items-center gap-1">
        <PageButton onClick={() => onChange?.("prev")}>上一页</PageButton>
        {pages.map((p) => (
          <PageButton key={p} active={p === current} onClick={() => onChange?.(p)}>
            {p}
          </PageButton>
        ))}
        <PageButton onClick={() => onChange?.("next")}>下一页</PageButton>
      </div>
    </div>
  );
}

function PageButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "min-w-[32px] h-8 px-2.5 rounded-md body12-cn-regular border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}
