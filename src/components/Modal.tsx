import * as React from "react";
import { X } from "lucide-react";
import { Button, cn } from "./ui";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const widths: Record<ModalSize, string> = {
  sm: "w-[420px]",
  md: "w-[560px]",
  lg: "w-[720px]",
  xl: "w-[920px]",
};

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  size = "md",
}: {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  size?: ModalSize;
}) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "relative bg-card rounded-lg shadow-xl max-h-[85vh] flex flex-col overflow-hidden",
          widths[size],
        )}
      >
        <div className="flex items-center justify-between px-5 h-12 border-b border-border shrink-0">
          <div className="h1-cn-medium text-foreground">{title}</div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 h-13 py-3 border-t border-border flex items-center justify-end gap-2 shrink-0 bg-[var(--input-background)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmFooter({
  onCancel,
  onConfirm,
  cancelLabel = "取消",
  confirmLabel = "确定",
  confirmVariant = "primary",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "secondary";
}) {
  return (
    <>
      <Button onClick={onCancel}>{cancelLabel}</Button>
      <Button variant={confirmVariant} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </>
  );
}

/* ------------------------------- Toast ------------------------------- */
type ToastItem = { id: number; msg: string; type: "success" | "error" | "info" };
let toastSeq = 0;
const listeners = new Set<(items: ToastItem[]) => void>();
let items: ToastItem[] = [];

export function showToast(msg: string, type: ToastItem["type"] = "success") {
  const id = ++toastSeq;
  items = [...items, { id, msg, type }];
  listeners.forEach((l) => l(items));
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    listeners.forEach((l) => l(items));
  }, 2400);
}

export function ToastHost() {
  const [list, setList] = React.useState<ToastItem[]>(items);
  React.useEffect(() => {
    listeners.add(setList);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
      {list.map((t) => (
        <div
          key={t.id}
          className={cn(
            "px-4 py-2 rounded-md body12-cn-regular shadow-lg bg-card border",
            t.type === "success" && "border-[var(--success)] text-[var(--success)]",
            t.type === "error" && "border-[var(--destructive)] text-[var(--destructive)]",
            t.type === "info" && "border-border text-foreground",
          )}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* --------------------------- Form atoms --------------------------- */
export function FormRow({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="body12-cn-medium text-foreground">
        {required && <span className="text-[var(--destructive)] mr-0.5">*</span>}
        {label}
      </label>
      {children}
      {hint && <span className="body10-cn-regular text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[80px] px-3 py-2 rounded-md bg-input-background border border-transparent focus:border-primary/40 focus:outline-none body12-cn-regular text-foreground placeholder:text-muted-foreground resize-y",
        className,
      )}
      {...rest}
    />
  );
}

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
          checked ? "left-[18px]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function StepperHeader({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center body12-cn-medium",
                  active && "bg-primary text-primary-foreground",
                  done && "bg-[var(--success)] text-white",
                  !active && !done && "bg-muted text-muted-foreground",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={cn(
                  "body12-cn-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-12 h-px bg-border" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
