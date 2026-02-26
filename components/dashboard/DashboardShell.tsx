"use client";

import type { OpenF1Session } from "@/types/api";

type DashboardShellProps = {
  session: OpenF1Session | null;
  usedFallback: boolean;
  effectiveYear: number;
  requestedYear: number;
  children: React.ReactNode;
};

export default function DashboardShell({
  session,
  usedFallback,
  effectiveYear,
  requestedYear,
  children,
}: DashboardShellProps) {
  const sessionLabel = session
    ? `${session.circuit_short_name ?? session.location ?? "Circuit"} / ${session.session_name}`
    : "No session";

  return (
    <main className="min-h-screen pt-16 md:pt-12 pb-8">
      <div className="max-w-[1400px] mx-auto px-3">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f41d00]/80 font-mono">
              BoxBox Telemetry
            </p>
            <h1 className="font-f1-wide text-xl md:text-2xl text-neutral-100 -mt-0.5">
              F1 Analytics
            </h1>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
            <span className="px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900/60">
              {sessionLabel}
            </span>
            {usedFallback && (
              <span className="px-2 py-0.5 rounded border border-amber-800/50 bg-amber-900/20 text-amber-300">
                Fallback: {effectiveYear} (requested {requestedYear})
              </span>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#f41d00]/40 via-[#f41d00]/15 to-transparent mb-4" />

        {children}
      </div>
    </main>
  );
}
