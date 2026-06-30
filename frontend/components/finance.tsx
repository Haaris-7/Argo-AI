"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Landmark } from "lucide-react";
import { api } from "@/lib/api";
import type { LedgerEntry } from "@/lib/types";
import { apiErrorMessage, money, relativeTime, titleCase } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState, MetricStrip, PageHeader } from "@/components/ui";

export function FinanceScreen() {
  const query = useQuery<{ items: LedgerEntry[]; total: number }>({ queryKey: ["ledger"], queryFn: () => api("/v1/ledger") });
  const rows = query.data?.items ?? [];
  const funded = rows.filter((row) => row.amount_cents > 0).reduce((sum, row) => sum + row.amount_cents, 0);
  const spent = Math.abs(rows.filter((row) => row.amount_cents < 0).reduce((sum, row) => sum + row.amount_cents, 0));
  const held = funded - spent;
  const utilization = funded ? Math.min(100, (spent / funded) * 100) : 0;

  return <>
    <PageHeader eyebrow="Authoritative ledger" title="Finance" description="Funding, approved Link purchases, and creator transfers reconciled from the source of truth." />
    <MetricStrip items={[{ label: "Total funding", value: money(funded), note: "Confirmed incoming funds" }, { label: "Total outflow", value: money(spent), note: `${utilization.toFixed(0)}% of funded capital` }, { label: "Net held", value: money(held), note: "Available or reserved" }, { label: "Ledger records", value: String(rows.length), note: "Auditable references" }]} />
    <section className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[10px] border border-[#dce4e3] bg-[#10211f] p-5 text-white">
        <Landmark className="h-5 w-5 text-[#78cac7]" />
        <h2 className="mt-4 text-[18px] font-semibold">Capital utilization</h2>
        <p className="mt-1 text-sm text-white/65">Money only leaves after an explicit approval and provider confirmation.</p>
        <p className="mt-7 text-[36px] font-semibold tracking-[-.04em] tabular-nums">{utilization.toFixed(0)}%</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#019393]" style={{ width: `${utilization}%` }} /></div>
        <div className="mt-5 flex justify-between text-xs text-white/60"><span>Transferred</span><span>{money(spent)} / {money(funded)}</span></div>
      </aside>
      <div>
        <div className="mb-3 flex items-end justify-between"><div><h2 className="text-[17px] font-semibold">Ledger activity</h2><p className="mt-1 text-sm text-[#526360]">References remain tied to campaign and provider records.</p></div><span className="text-xs text-[#687975]">Newest first</span></div>
        {query.isLoading ? <LoadingState /> : query.error ? <ErrorState message={apiErrorMessage(query.error)} retry={() => query.refetch()} /> : !rows.length ? <EmptyState title="No ledger entries" detail="Campaign funding and transfers will appear here." /> : (
          <div className="overflow-hidden rounded-[10px] border border-[#dce4e3] bg-white">{rows.map((row) => <div key={row.id} className="grid gap-3 border-b border-[#dce4e3] p-4 last:border-0 sm:grid-cols-[40px_1fr_1fr_auto] sm:items-center"><span className={`grid h-9 w-9 place-items-center rounded-[8px] ${row.amount_cents > 0 ? "bg-[#edf8f3] text-[#167a5b]" : "bg-[#fff0ef] text-[#b42318]"}`}>{row.amount_cents > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><div><strong>{titleCase(row.entry_type)}</strong><p className="text-xs text-[#526360]">{row.campaign_name}</p></div><div className="text-xs text-[#526360]"><code>{row.reference_id}</code><p className="mt-1 text-[#687975]">{relativeTime(row.created_at)}</p></div><strong className={`tabular-nums ${row.amount_cents > 0 ? "text-[#167a5b]" : "text-[#b42318]"}`}>{row.amount_cents > 0 ? "+" : "−"}{money(Math.abs(row.amount_cents))}</strong></div>)}</div>
        )}
      </div>
    </section>
  </>;
}
