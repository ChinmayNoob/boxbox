"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import type { DashboardData, JolpicaPitStop } from "@/types/api";
import Panel from "@/components/dashboard/Panel";
import SectionHeader from "@/components/dashboard/SectionHeader";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import { getTeamColor } from "@/lib/api/dashboard";

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: "#ef4444",
  MEDIUM: "#eab308",
  HARD: "#f5f5f5",
  INTERMEDIATE: "#22c55e",
  WET: "#3b82f6",
  UNKNOWN: "#6b7280",
  TEST_UNKNOWN: "#6b7280",
};

const JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1";

type PitStopRow = { driver: string; duration: number; lap: number; stop: number };

export default function StrategyTab({ data }: { data: DashboardData }) {
  const { stints, drivers, raceResults, requestedSeason, intervals, driverStandings } = data;

  const [pitStops, setPitStops] = useState<PitStopRow[]>([]);
  const [pitLoading, setPitLoading] = useState(false);

  const lastRound =
    raceResults.length > 0 ? raceResults[raceResults.length - 1].round : null;

  const fetchPitStops = useCallback(async () => {
    if (!lastRound) return;
    setPitLoading(true);
    try {
      const res = await fetch(
        `${JOLPICA_BASE}/${requestedSeason}/${lastRound}/pitstops?limit=100`,
      );
      const json = await res.json();
      const races = json?.MRData?.RaceTable?.Races;
      if (!Array.isArray(races) || races.length === 0) {
        setPitStops([]);
        return;
      }
      const raw: JolpicaPitStop[] = races[0].PitStops ?? [];
      setPitStops(
        raw.map((p) => ({
          driver: p.driverId,
          duration: parseFloat(p.duration) || 0,
          lap: parseInt(p.lap) || 0,
          stop: parseInt(p.stop) || 0,
        })),
      );
    } catch {
      setPitStops([]);
    } finally {
      setPitLoading(false);
    }
  }, [lastRound, requestedSeason]);

  useEffect(() => {
    fetchPitStops();
  }, [fetchPitStops]);

  const driverNumMap = useMemo(
    () => new Map(drivers.map((d) => [d.driver_number, d])),
    [drivers],
  );

  // Stint timeline data: group by driver
  const stintsByDriver = useMemo(() => {
    const map = new Map<
      number,
      { driver: string; color: string; stints: typeof stints }
    >();
    for (const s of stints) {
      if (!map.has(s.driver_number)) {
        const d = driverNumMap.get(s.driver_number);
        map.set(s.driver_number, {
          driver: d?.name_acronym ?? `#${s.driver_number}`,
          color: d?.team_colour ? `#${d.team_colour}` : "#666",
          stints: [],
        });
      }
      map.get(s.driver_number)!.stints.push(s);
    }
    return Array.from(map.values()).sort((a, b) => {
      const posA = driverStandings.find((ds) => ds.code === a.driver)?.position ?? 99;
      const posB = driverStandings.find((ds) => ds.code === b.driver)?.position ?? 99;
      return posA - posB;
    });
  }, [stints, driverNumMap, driverStandings]);

  // Compound distribution for pie chart
  const compoundDist = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of stints) {
      const compound = s.compound || "UNKNOWN";
      const lapCount = s.lap_end - s.lap_start + 1;
      counts[compound] = (counts[compound] || 0) + lapCount;
    }
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: COMPOUND_COLORS[name] ?? "#6b7280",
    }));
  }, [stints]);

  // Pit stop bar chart: average per driver
  const pitBarData = useMemo(() => {
    const byDriver = new Map<string, { total: number; count: number }>();
    for (const ps of pitStops) {
      const ex = byDriver.get(ps.driver) ?? { total: 0, count: 0 };
      ex.total += ps.duration;
      ex.count++;
      byDriver.set(ps.driver, ex);
    }
    return Array.from(byDriver.entries())
      .map(([driver, { total, count }]) => ({
        driver: driver.slice(0, 3).toUpperCase(),
        avg: Math.round((total / count) * 100) / 100,
        stops: count,
        color: getTeamColor(
          driverStandings.find(
            (d) => d.driverId === driver,
          )?.team ?? "Unknown",
        ),
      }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 20);
  }, [pitStops, driverStandings]);

  // Gap chart: intervals over time (sampled)
  const gapChartData = useMemo(() => {
    if (intervals.length === 0) return [];
    const top5 = driverStandings.slice(0, 5);
    const top5Nums = new Set(top5.map((d) => d.driverNumber).filter(Boolean));

    const filtered = intervals.filter(
      (iv) => top5Nums.has(iv.driver_number) && iv.gap_to_leader !== null,
    );
    if (filtered.length === 0) return [];

    const sampled = filtered.filter((_, i) => i % 10 === 0);
    const byTime = new Map<string, Record<string, unknown>>();
    for (const iv of sampled) {
      const timeKey = iv.date.slice(11, 19);
      const entry = byTime.get(timeKey) ?? { time: timeKey };
      const d = driverNumMap.get(iv.driver_number);
      const key = d?.name_acronym ?? `#${iv.driver_number}`;
      entry[key] = iv.gap_to_leader;
      byTime.set(timeKey, entry);
    }
    return Array.from(byTime.values()).slice(0, 200);
  }, [intervals, driverStandings, driverNumMap]);

  const gapKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const e of gapChartData) {
      for (const k of Object.keys(e)) {
        if (k !== "time") keys.add(k);
      }
    }
    return Array.from(keys);
  }, [gapChartData]);

  const gapColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const key of gapKeys) {
      const d = drivers.find((dr) => dr.name_acronym === key);
      colors[key] = d?.team_colour ? `#${d.team_colour}` : "#666";
    }
    return colors;
  }, [gapKeys, drivers]);

  // Pit stop laps for reference lines on gap chart
  const pitLapTimes = useMemo(() => {
    return pitStops
      .filter((ps) => ps.stop === 1)
      .map((ps) => ({ driver: ps.driver, lap: ps.lap }));
  }, [pitStops]);

  const maxLapOnTimeline = useMemo(() => {
    if (stints.length === 0) return 60;
    return Math.max(...stints.map((s) => s.lap_end));
  }, [stints]);

  return (
    <div className="space-y-3">
      {/* Stint Timeline */}
      <Panel>
        <SectionHeader
          title="Stint Timeline"
          subtitle="Tire compound usage per driver"
        />
        <div className="overflow-x-auto">
          <div
            className="space-y-1"
            style={{ minWidth: 700 }}
          >
            {/* Lap ruler */}
            <div className="flex items-center h-5 pl-14">
              {Array.from({ length: Math.ceil(maxLapOnTimeline / 10) + 1 }, (_, i) => i * 10).map(
                (l) => (
                  <span
                    key={l}
                    className="text-[9px] text-neutral-600 font-mono absolute"
                    style={{
                      left: `${(l / maxLapOnTimeline) * 100}%`,
                      position: "relative",
                    }}
                  >
                    L{l}
                  </span>
                ),
              )}
            </div>

            {stintsByDriver.map((row) => (
              <div key={row.driver} className="flex items-center gap-2 h-6">
                <span className="text-[10px] font-mono text-neutral-300 w-12 text-right shrink-0">
                  {row.driver}
                </span>
                <div className="relative flex-1 h-4 bg-neutral-900/60 rounded-sm overflow-hidden">
                  {row.stints.map((s, i) => {
                    const left =
                      ((s.lap_start - 1) / maxLapOnTimeline) * 100;
                    const width =
                      ((s.lap_end - s.lap_start + 1) / maxLapOnTimeline) * 100;
                    return (
                      <div
                        key={i}
                        className="absolute top-0 h-full rounded-sm border-r border-black/30"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          background:
                            COMPOUND_COLORS[s.compound] ?? "#6b7280",
                          opacity: 0.8,
                        }}
                        title={`${s.compound} L${s.lap_start}-${s.lap_end}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-3 pt-1 pl-14">
              {Object.entries(COMPOUND_COLORS)
                .filter(([k]) => !["UNKNOWN", "TEST_UNKNOWN"].includes(k))
                .map(([name, color]) => (
                  <span key={name} className="flex items-center gap-1 text-[9px] text-neutral-400">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: color }}
                    />
                    {name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Pit Stop Duration + Compound Dist */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,340px] gap-3">
        <Panel>
          <SectionHeader
            title="Pit Stop Duration"
            subtitle={pitLoading ? "Loading..." : `${pitStops.length} stops`}
          />
          <div className="h-[240px]">
            {pitBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pitBarData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="driver" stroke="#555" fontSize={9} tickLine={false} />
                  <YAxis stroke="#555" fontSize={9} tickLine={false} unit="s" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="avg" name="Avg Duration (s)" radius={[3, 3, 0, 0]}>
                    {pitBarData.map((e, i) => (
                      <Cell key={i} fill={e.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No pit stop data available
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Compound Distribution" subtitle="Total laps by compound" />
          <div className="h-[240px]">
            {compoundDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<ChartTooltip />} />
                  <Pie
                    data={compoundDist}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {compoundDist.map((e, i) => (
                      <Cell key={i} fill={e.color} fillOpacity={0.85} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No stint data
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {compoundDist.map((c) => (
              <span key={c.name} className="text-[10px] text-neutral-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                {c.name}: {c.value} laps
              </span>
            ))}
          </div>
        </Panel>
      </div>

      {/* Gap to Leader */}
      <Panel>
        <SectionHeader
          title="Gap to Leader"
          subtitle={
            pitLapTimes.length > 0
              ? "Top 5 drivers with pit stop markers"
              : "Top 5 drivers gap progression"
          }
        />
        <div className="h-[260px]">
          {gapChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gapChartData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" stroke="#444" fontSize={8} tickLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#444" fontSize={8} tickLine={false} unit="s" />
                <Tooltip content={<ChartTooltip />} />
                {pitLapTimes.slice(0, 8).map((pl, i) => (
                  <ReferenceLine
                    key={i}
                    x={gapChartData[Math.min(pl.lap * 2, gapChartData.length - 1)]?.time as string | undefined}
                    stroke="rgba(244,29,0,0.3)"
                    strokeDasharray="3 3"
                    label={{
                      value: `PIT`,
                      position: "top",
                      fill: "#f41d00",
                      fontSize: 8,
                    }}
                  />
                ))}
                {gapKeys.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key}
                    stroke={gapColors[key]}
                    strokeWidth={1.5}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
              No interval data for this session
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
