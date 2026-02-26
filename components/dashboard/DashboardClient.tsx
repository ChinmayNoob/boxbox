"use client";

import { useState } from "react";
import type { DashboardData } from "@/types/api";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import TelemetryTab from "@/components/dashboard/tabs/TelemetryTab";
import StrategyTab from "@/components/dashboard/tabs/StrategyTab";
import HeadToHeadTab from "@/components/dashboard/tabs/HeadToHeadTab";

type Tab = "overview" | "telemetry" | "strategy" | "h2h";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "telemetry", label: "Telemetry" },
  { id: "strategy", label: "Strategy" },
  { id: "h2h", label: "Head-to-Head" },
];

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <>
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 bg-[#0d1117]/60 border border-neutral-800/60 rounded-lg p-0.5 w-fit mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-md text-xs font-f1-regular transition-all ${
              tab === t.id
                ? "bg-[#f41d00]/15 text-[#ff6b5a] border border-[#f41d00]/30"
                : "text-neutral-400 hover:text-neutral-200 border border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active tab */}
      {tab === "overview" && <OverviewTab data={data} />}
      {tab === "telemetry" && <TelemetryTab data={data} />}
      {tab === "strategy" && <StrategyTab data={data} />}
      {tab === "h2h" && <HeadToHeadTab data={data} />}
    </>
  );
}
