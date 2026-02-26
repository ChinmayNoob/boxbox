"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import type { DashboardData } from "@/types/api";
import Panel from "@/components/dashboard/Panel";
import SectionHeader from "@/components/dashboard/SectionHeader";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import { getCircuitGeojsonPath } from "@/components/dashboard/circuit-map";

type Point = { x: number; y: number };

function projectCoords(
  coords: [number, number][],
  w: number,
  h: number,
): Point[] {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  const geoW = maxLng - minLng || 1;
  const geoH = maxLat - minLat || 1;
  const pad = 12;
  const scale = Math.min((w - pad * 2) / geoW, (h - pad * 2) / geoH);
  const ox = pad + ((w - pad * 2) - geoW * scale) / 2;
  const oy = pad + ((h - pad * 2) - geoH * scale) / 2;
  return coords.map(([lng, lat]) => ({
    x: ox + (lng - minLng) * scale,
    y: oy + (maxLat - lat) * scale,
  }));
}

function toPath(pts: Point[]): string {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

export default function OverviewTab({ data }: { data: DashboardData }) {
  const {
    kpis,
    driverStandings,
    constructorStandings,
    positions,
    laps,
    drivers,
    weather,
    races,
  } = data;

  const [selectedRaceIndex, setSelectedRaceIndex] = useState(
    () => (races.length > 0 ? races.length - 1 : 0),
  );

  // KPIs
  const kpiItems = [
    { label: "LEADER", value: kpis.seasonLeader, sub: `${kpis.seasonLeaderPoints} pts` },
    { label: "TOP CONSTRUCTOR", value: kpis.topConstructor, sub: `${kpis.topConstructorPoints} pts` },
    { label: "RACES", value: `${kpis.completedRaces}/${kpis.scheduledRaces}`, sub: "completed" },
    { label: "TRACK TEMP", value: kpis.avgTrackTemp ? `${kpis.avgTrackTemp}°C` : "—", sub: "avg session" },
    { label: "CIRCUIT", value: kpis.latestCircuitName.length > 18 ? kpis.latestCircuitName.slice(0, 18) + "…" : kpis.latestCircuitName, sub: "latest" },
    { label: "WEATHER", value: weather.length > 0 ? (weather[weather.length - 1].rainfall ? "WET" : "DRY") : "—", sub: `${weather.length > 0 ? Math.round(weather[weather.length - 1].air_temperature) + "°C air" : "—"}` },
  ];

  // Driver standings bar data
  const driverBarData = useMemo(
    () =>
      driverStandings.slice(0, 20).map((d) => ({
        name: d.code,
        points: d.points,
        color: d.teamColor ?? "#f41d00",
      })),
    [driverStandings],
  );

  // Constructor area data
  const constructorAreaData = useMemo(
    () =>
      constructorStandings.map((c) => ({
        team: c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name,
        points: c.points,
      })),
    [constructorStandings],
  );

  // Position change chart: top 5 drivers over laps
  const driverMap = useMemo(
    () => new Map(drivers.map((d) => [d.driver_number, d])),
    [drivers],
  );

  const positionChartData = useMemo(() => {
    if (positions.length === 0 || laps.length === 0) return [];
    const top5Numbers = driverStandings.slice(0, 5).map((d) => d.driverNumber).filter(Boolean) as number[];
    if (top5Numbers.length === 0) return [];

    const maxLap = Math.max(...laps.map((l) => l.lap_number));
    const result: Record<string, unknown>[] = [];

    for (let lap = 1; lap <= Math.min(maxLap, 60); lap++) {
      const lapData = laps.filter((l) => l.lap_number === lap);
      const entry: Record<string, unknown> = { lap };
      for (const num of top5Numbers) {
        const lapEntry = lapData.find((l) => l.driver_number === num);
        if (lapEntry) {
          const posAtLap = positions
            .filter(
              (p) =>
                p.driver_number === num &&
                new Date(p.date).getTime() <= new Date(lapEntry.date_start).getTime() + (lapEntry.lap_duration ?? 90) * 1000,
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          if (posAtLap) {
            const d = driverMap.get(num);
            entry[d?.name_acronym ?? `#${num}`] = posAtLap.position;
          }
        }
      }
      result.push(entry);
    }
    return result;
  }, [positions, laps, driverStandings, driverMap]);

  const posChartKeys = useMemo(() => {
    if (positionChartData.length === 0) return [];
    const keys = new Set<string>();
    for (const entry of positionChartData) {
      for (const k of Object.keys(entry)) {
        if (k !== "lap") keys.add(k);
      }
    }
    return Array.from(keys);
  }, [positionChartData]);

  const posChartColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const key of posChartKeys) {
      const driver = drivers.find((d) => d.name_acronym === key);
      colors[key] = driver?.team_colour ? `#${driver.team_colour}` : "#666";
    }
    return colors;
  }, [posChartKeys, drivers]);

  // Circuit SVG
  const [circuitPath, setCircuitPath] = useState("");
  const selectedRace =
    races[selectedRaceIndex] ?? races[races.length - 1] ?? undefined;
  const geojsonSrc = getCircuitGeojsonPath(selectedRace?.Circuit?.circuitId);

  useEffect(() => {
    if (!geojsonSrc) return;
    fetch(geojsonSrc)
      .then((r) => r.json())
      .then((data: { features?: { geometry?: { coordinates?: unknown } }[] }) => {
        let raw = data?.features?.[0]?.geometry?.coordinates;
        if (!raw) return;
        if (Array.isArray(raw) && Array.isArray((raw as unknown[])[0]) && Array.isArray(((raw as unknown[])[0] as unknown[])[0])) {
          raw = (raw as [number, number][][])[0];
        }
        const pts = projectCoords(raw as [number, number][], 360, 200);
        setCircuitPath(toPath(pts));
      })
      .catch(() => {});
  }, [geojsonSrc]);

  return (
    <div className="space-y-3">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
        {kpiItems.map((k) => (
          <Panel key={k.label} className="!p-2.5">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
              {k.label}
            </p>
            <p className="text-sm font-f1-bold text-neutral-100 mt-1 truncate">
              {k.value}
            </p>
            <p className="text-[10px] text-neutral-500">{k.sub}</p>
          </Panel>
        ))}
      </div>

      {/* Row: Driver Standings + Constructor */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-3">
        <Panel>
          <SectionHeader title="Driver Championship" subtitle="Points distribution" />
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverBarData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#555" fontSize={9} tickLine={false} />
                <YAxis stroke="#555" fontSize={9} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="points" name="Points" radius={[3, 3, 0, 0]}>
                  {driverBarData.map((e) => (
                    <Cell key={e.name} fill={e.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Constructors" subtitle="Team points" />
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={constructorAreaData} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f41d00" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f41d00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="team" stroke="#555" fontSize={9} tickLine={false} />
                <YAxis stroke="#555" fontSize={9} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="points"
                  name="Points"
                  stroke="#f41d00"
                  fill="url(#cGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Row: Position Chart + Circuit */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-3">
        <Panel>
          <SectionHeader
            title="Race Position Changes"
            subtitle="Top 5 drivers lap-by-lap positions"
          />
          <div className="h-[280px]">
            {positionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={positionChartData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="lap" stroke="#555" fontSize={9} tickLine={false} />
                  <YAxis reversed domain={[1, 20]} stroke="#555" fontSize={9} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  {posChartKeys.map((key) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={posChartColors[key]}
                      strokeWidth={1.5}
                      dot={false}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No position data for this session
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            title={selectedRace?.Circuit?.circuitName ?? "Circuit"}
            subtitle={
              selectedRace
                ? `${selectedRace.Circuit.Location.locality}, ${selectedRace.Circuit.Location.country}`
                : ""
            }
          >
            {races.length > 0 && (
              <select
                value={selectedRaceIndex}
                onChange={(e) => setSelectedRaceIndex(Number(e.target.value))}
                className="rounded border border-neutral-800 bg-neutral-900/80 px-2 py-1 text-[11px] text-neutral-200 outline-none"
              >
                {races.map((race, idx) => (
                  <option key={`${race.season}-${race.round}`} value={idx}>
                    {race.raceName.replace(" Grand Prix", " GP")}
                  </option>
                ))}
              </select>
            )}
          </SectionHeader>
          <div className="h-[280px] flex items-center justify-center">
            {circuitPath ? (
              <svg viewBox="0 0 360 200" className="w-full h-full max-h-[240px]">
                <defs>
                  <linearGradient id="trkG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f41d00" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
                <path
                  d={circuitPath}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={6}
                  fill="none"
                />
                <path
                  d={circuitPath}
                  stroke="url(#trkG)"
                  strokeWidth={2}
                  fill="none"
                />
              </svg>
            ) : (
              <p className="text-neutral-600 text-xs">No track geometry available</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
