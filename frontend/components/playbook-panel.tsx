"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, RadioTower } from "lucide-react";
import { api } from "@/lib/api";
import type { AlgorithmPlaybook } from "@/lib/types";
import { apiErrorMessage, relativeTime, titleCase } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";

function safeSourceUrl(value?: string) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null; } catch { return null; }
}

export function PlaybookPanel() {
  const query = useQuery<{ items: AlgorithmPlaybook[]; total: number }>({ queryKey: ["algorithm-playbook"], queryFn: () => api("/v1/playbook"), refetchInterval: 60_000 });
  if (query.isLoading) return <LoadingState label="Loading platform intelligence" />;
  if (query.error || !query.data) return <ErrorState message={apiErrorMessage(query.error)} retry={() => query.refetch()} />;
  if (!query.data.items.length) return <section className="mt-8"><EmptyState title="No platform intelligence yet" detail="Generate a campaign strategy to research and store the first algorithm playbook." /></section>;

  return (
    <section className="mt-8 overflow-hidden rounded-[10px] border border-[#dce4e3] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce4e3] px-5 py-4">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-[#e6f5f4] text-[#006e6e]"><RadioTower className="h-4 w-4" /></span><div><h2 className="text-[17px] font-semibold">Algorithm intelligence</h2><p className="text-sm text-[#526360]">Current platform signals supplied to strategy generation.</p></div></div>
        <span className="text-xs font-semibold text-[#526360]">{query.data.total} active {query.data.total === 1 ? "playbook" : "playbooks"}</span>
      </div>
      <div className="divide-y divide-[#dce4e3]">
        {query.data.items.map((playbook) => (
          <article key={playbook.id} className="grid gap-6 p-5 lg:grid-cols-[170px_minmax(0,1fr)_260px]">
            <div><p className="text-sm font-semibold text-[#526360]">{titleCase(playbook.platform)}</p><p className="mt-2 text-[30px] font-semibold tracking-[-.04em] tabular-nums">{Math.round(playbook.confidence * 100)}%</p><p className="mt-1 text-xs text-[#687975]">confidence · {relativeTime(playbook.updated_at)}</p></div>
            <ol className="space-y-4">{playbook.signals.map((signal, index) => <li key={`${playbook.id}-signal-${index}`} className="grid grid-cols-[24px_1fr] gap-3"><span className="pt-0.5 text-xs font-semibold tabular-nums text-[#019393]">{String(index + 1).padStart(2, "0")}</span><div><strong className="leading-6">{signal.signal ?? "Platform ranking signal"}</strong>{signal.effect && <p className="mt-1 text-sm leading-6 text-[#526360]">{signal.effect}</p>}</div></li>)}</ol>
            <div><p className="text-xs font-semibold text-[#687975]">Evidence sources</p><div className="mt-3 space-y-2">{playbook.sources.map((source, index) => { const href = safeSourceUrl(source.url); const label = source.title ?? source.url ?? `Source ${index + 1}`; return href ? <a key={`${playbook.id}-source-${index}`} href={href} target="_blank" rel="noreferrer" className="flex min-h-9 items-center justify-between gap-3 text-sm font-medium hover:text-[#006e6e]"><span>{label}</span><ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a> : <p key={`${playbook.id}-source-${index}`} className="py-1 text-sm text-[#526360]">{label}</p>; })}</div></div>
          </article>
        ))}
      </div>
    </section>
  );
}
