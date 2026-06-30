import { AlertCircle, ArrowRight, Check, CircleDashed, LoaderCircle, X } from "lucide-react";
import Link from "next/link";
import { cn, titleCase } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[#006e6e] text-white hover:bg-[#005b5b] active:bg-[#004e4e]",
        variant === "secondary" && "border border-[#c5d1d0] bg-white text-[#10211f] hover:border-[#019393] hover:bg-[#f6fbfa]",
        variant === "ghost" && "text-[#354542] hover:bg-[#eef2f2] hover:text-[#10211f]",
        variant === "danger" && "bg-[#b42318] text-white hover:bg-[#8f1c13]",
        className,
      )}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#006e6e] hover:text-[#004e4e]">
      {children}<ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}

const positive = new Set(["completed", "applied", "verified", "transferred", "succeeded", "healthy", "operational"]);
const attention = new Set(["awaiting_approval", "pending_approval", "revision_required", "attention", "pending"]);
const danger = new Set(["failed", "rejected", "unavailable"]);

export function StatusBadge({ value }: { value: string }) {
  const style = positive.has(value)
    ? "border-[#b5dbce] bg-[#edf8f3] text-[#126448]"
    : attention.has(value)
      ? "border-[#e6c98d] bg-[#fff7e7] text-[#7d5100]"
      : danger.has(value)
        ? "border-[#edb8b3] bg-[#fff0ef] text-[#952017]"
        : ["active", "approved"].includes(value)
          ? "border-[#a9d8d5] bg-[#e6f5f4] text-[#006e6e]"
          : "border-[#d5dddc] bg-[#f1f4f3] text-[#526360]";
  const Icon = positive.has(value) ? Check : danger.has(value) ? X : CircleDashed;
  return (
    <span className={cn("inline-flex min-h-7 items-center gap-1.5 rounded-[6px] border px-2 py-1 text-xs font-semibold", style)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {titleCase(value)}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-[#dce4e3] pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-medium text-[#526360]">{eyebrow}</p>}
        <h1 className="display-face text-[32px] leading-[1.12] md:text-[36px]">{title}</h1>
        {description && <p className="mt-2 max-w-[70ch] text-[15px] leading-6 text-[#526360]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function MetricStrip({ items }: { items: Array<{ label: string; value: string; note?: string }> }) {
  return (
    <dl className="grid overflow-hidden rounded-[10px] border border-[#dce4e3] bg-white shadow-[0_1px_2px_rgba(16,33,31,.04)] md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="border-b border-[#dce4e3] p-5 md:odd:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
          <dt className="text-xs font-semibold text-[#526360]">{item.label}</dt>
          <dd className="mt-2 text-[28px] font-semibold tracking-[-.04em] tabular-nums">{item.value}</dd>
          {item.note && <p className="mt-1 text-xs text-[#687975]">{item.note}</p>}
        </div>
      ))}
    </dl>
  );
}

export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return <div className="flex min-h-52 items-center justify-center gap-3 text-[#526360]" role="status"><LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />{label}</div>;
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="flex items-start justify-between gap-5 rounded-[8px] border border-[#edb8b3] bg-[#fff0ef] px-4 py-4 text-[#7e1c14]">
      <div className="flex gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /><p>{message}</p></div>
      {retry && <Button variant="secondary" onClick={retry}>Retry</Button>}
    </div>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-dashed border-[#c5d1d0] bg-[#f8fafa] px-6 py-12 text-center">
      <p className="text-lg font-semibold">{title}</p><p className="mx-auto mt-2 max-w-md text-[#526360]">{detail}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
