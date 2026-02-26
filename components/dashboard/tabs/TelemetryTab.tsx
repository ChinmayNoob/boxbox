"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { DashboardData, OpenF1CarData } from "@/types/api";
import Panel from "@/components/dashboard/Panel";
import SectionHeader from "@/components/dashboard/SectionHeader";
import ChartTooltip from "@/components/dashboard/ChartTooltip";

const OPENF1_BASE = "https://api.openf1.org/v1";

type MergedSample = {
  idx: number;
  speedA: number | null;
  speedB: number | null;
  throttleA: number | null;
  throttleB: number | null;
  brakeA: number | null;
  brakeB: number | null;
  rpmA: number | null;
  rpmB: number | null;
  gearA: number | null;
  gearB: number | null;
  drsA: number | null;
  drsB: number | null;
};

function filterLapData(
  allData: OpenF1CarData[],
  lapStartMs: number,
  lapEndMs: number,
): OpenF1CarData[] {
  return allData.filter((d) => {
    const t = new Date(d.date).getTime();
    return t >= lapStartMs && t <= lapEndMs;
  });
}

function downsample(data: OpenF1CarData[], maxPoints: number): OpenF1CarData[] {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}

function mergeTraces(
  a: OpenF1CarData[],
  b: OpenF1CarData[],
): MergedSample[] {
  const maxLen = Math.max(a.length, b.length);
  const result: MergedSample[] = [];
  for (let i = 0; i < maxLen; i++) {
    const da = a[i] ?? null;
    const db = b[i] ?? null;
    result.push({
      idx: i,
      speedA: da?.speed ?? null,
      speedB: db?.speed ?? null,
      throttleA: da?.throttle ?? null,
      throttleB: db?.throttle ?? null,
      brakeA: da?.brake ?? null,
      brakeB: db?.brake ?? null,
      rpmA: da?.rpm ?? null,
      rpmB: db?.rpm ?? null,
      gearA: da?.n_gear ?? null,
      gearB: db?.n_gear ?? null,
      drsA: da?.drs ?? null,
      drsB: db?.drs ?? null,
    });
  }
  return result;
}

export default function TelemetryTab({ data }: { data: DashboardData }) {
  const { teamPairs, selectedSession, laps, drivers } = data;

  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
  const [selectedLap, setSelectedLap] = useState(5);
  const [carDataA, setCarDataA] = useState<OpenF1CarData[]>([]);
  const [carDataB, setCarDataB] = useState<OpenF1CarData[]>([]);
  const [loading, setLoading] = useState(false);

  const pair = teamPairs[selectedTeamIdx];
  const driverA = pair?.drivers[0];
  const driverB = pair?.drivers[1];

  const openf1DriverA = useMemo(
    () => drivers.find((d) => d.name_acronym === driverA?.code),
    [drivers, driverA],
  );
  const openf1DriverB = useMemo(
    () => drivers.find((d) => d.name_acronym === driverB?.code),
    [drivers, driverB],
  );

  const colorA = openf1DriverA?.team_colour
    ? `#${openf1DriverA.team_colour}`
    : (driverA?.teamColor ?? "#ff8000");
  const colorB = "#00d4ff";

  const sessionKey = selectedSession?.session_key;
  const numA = openf1DriverA?.driver_number;
  const numB = openf1DriverB?.driver_number;

  const maxLap = useMemo(() => {
    if (laps.length === 0) return 10;
    return Math.max(...laps.map((l) => l.lap_number));
  }, [laps]);

  const lapStartEnd = useMemo(() => {
    if (!numA || !sessionKey) return null;
    const lapEntry = laps.find(
      (l) => l.driver_number === numA && l.lap_number === selectedLap,
    );
    if (!lapEntry) return null;
    const start = new Date(lapEntry.date_start).getTime();
    const duration = (lapEntry.lap_duration ?? 90) * 1000;
    return { start, end: start + duration };
  }, [laps, numA, sessionKey, selectedLap]);

  const fetchCarData = useCallback(async () => {
    if (!sessionKey || !numA) return;
    setLoading(true);
    try {
      const params = (num: number) =>
        `?session_key=${sessionKey}&driver_number=${num}`;
      const [resA, resB] = await Promise.all([
        fetch(`${OPENF1_BASE}/car_data${params(numA)}`).then((r) => r.json()),
        numB
          ? fetch(`${OPENF1_BASE}/car_data${params(numB)}`).then((r) => r.json())
          : Promise.resolve([]),
      ]);
      setCarDataA(Array.isArray(resA) ? resA : []);
      setCarDataB(Array.isArray(resB) ? resB : []);
    } catch {
      setCarDataA([]);
      setCarDataB([]);
    } finally {
      setLoading(false);
    }
  }, [sessionKey, numA, numB]);

  useEffect(() => {
    fetchCarData();
  }, [fetchCarData]);

  const merged = useMemo(() => {
    if (carDataA.length === 0 && carDataB.length === 0) return [];

    // If we cannot align a specific lap, fall back to the whole session
    if (!lapStartEnd) {
      const fullA = downsample(carDataA, 400);
      const fullB = downsample(carDataB, 400);
      return mergeTraces(fullA, fullB);
    }
    const filteredA = downsample(
      filterLapData(carDataA, lapStartEnd.start, lapStartEnd.end),
      200,
    );
    const filteredB = downsample(
      filterLapData(carDataB, lapStartEnd.start, lapStartEnd.end),
      200,
    );
    return mergeTraces(filteredA, filteredB);
  }, [carDataA, carDataB, lapStartEnd]);

  const nameA = driverA?.code ?? "Driver A";
  const nameB = driverB?.code ?? "Driver B";

  const chartHeight = 180;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <Panel className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          Team
          <select
            value={selectedTeamIdx}
            onChange={(e) => setSelectedTeamIdx(Number(e.target.value))}
            className="rounded border border-neutral-800 bg-neutral-900/80 px-2 py-1 text-neutral-200 text-xs outline-none"
          >
            {teamPairs.map((tp, i) => (
              <option key={tp.team} value={i}>
                {tp.team}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          Lap
          <input
            type="number"
            min={1}
            max={maxLap}
            value={selectedLap}
            onChange={(e) => setSelectedLap(Number(e.target.value))}
            className="rounded border border-neutral-800 bg-neutral-900/80 px-2 py-1 text-neutral-200 text-xs outline-none w-16"
          />
        </label>
        <div className="flex items-center gap-3 text-[11px] ml-auto">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colorA }} />
            {nameA}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colorB }} />
            {nameB}
          </span>
        </div>
        {selectedSession && (
          <span className="text-[10px] text-neutral-600 font-mono">
            Session {sessionKey} / {selectedSession.circuit_short_name}
          </span>
        )}
      </Panel>

      {loading ? (
        <Panel className="h-40 flex items-center justify-center">
          <p className="text-neutral-500 text-xs animate-pulse">
            Loading telemetry data from OpenF1...
          </p>
        </Panel>
      ) : merged.length === 0 ? (
        <Panel className="h-40 flex items-center justify-center">
          <p className="text-neutral-600 text-xs">
            No telemetry available for this lap. Try selecting a different lap or team.
          </p>
        </Panel>
      ) : (
        <>
          {/* Speed Trace */}
          <Panel>
            <SectionHeader title="Speed Trace" subtitle="km/h overlay" />
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={merged} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="idx" stroke="#444" fontSize={8} tickLine={false} />
                  <YAxis stroke="#444" fontSize={8} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="speedA" name={nameA} stroke={colorA} strokeWidth={1.2} dot={false} />
                  <Line type="monotone" dataKey="speedB" name={nameB} stroke={colorB} strokeWidth={1.2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Throttle / Brake */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <Panel>
              <SectionHeader title="Throttle" subtitle="0-100% application" />
              <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={merged} margin={{ left: -10 }}>
                    <defs>
                      <linearGradient id="thrA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colorA} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={colorA} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="idx" stroke="#444" fontSize={8} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#444" fontSize={8} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="throttleA" name={nameA} stroke={colorA} fill="url(#thrA)" strokeWidth={1} />
                    <Area type="monotone" dataKey="throttleB" name={nameB} stroke={colorB} fill="transparent" strokeWidth={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel>
              <SectionHeader title="Brake" subtitle="Application zones" />
              <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={merged} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="idx" stroke="#444" fontSize={8} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#444" fontSize={8} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="step" dataKey="brakeA" name={nameA} stroke="#ef4444" fill="rgba(239,68,68,0.15)" strokeWidth={1} />
                    <Area type="step" dataKey="brakeB" name={nameB} stroke="#f97316" fill="rgba(249,115,22,0.1)" strokeWidth={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* RPM + Gear */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <Panel>
              <SectionHeader title="RPM Curve" subtitle="Engine revolutions" />
              <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={merged} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="idx" stroke="#444" fontSize={8} tickLine={false} />
                    <YAxis stroke="#444" fontSize={8} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="rpmA" name={nameA} stroke={colorA} strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="rpmB" name={nameB} stroke={colorB} strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel>
              <SectionHeader title="Gear Selection" subtitle="Gear changes through lap" />
              <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={merged} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="idx" stroke="#444" fontSize={8} tickLine={false} />
                    <YAxis domain={[0, 8]} stroke="#444" fontSize={8} tickLine={false} ticks={[1, 2, 3, 4, 5, 6, 7, 8]} />
                    <Tooltip content={<ChartTooltip />} />
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                      <ReferenceLine key={g} y={g} stroke="rgba(255,255,255,0.04)" />
                    ))}
                    <Line type="stepAfter" dataKey="gearA" name={nameA} stroke={colorA} strokeWidth={1.5} dot={false} />
                    <Line type="stepAfter" dataKey="gearB" name={nameB} stroke={colorB} strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* DRS */}
          <Panel>
            <SectionHeader title="DRS Deployment" subtitle="DRS status through lap (>10 = open)" />
            <div style={{ height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={merged} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="idx" stroke="#444" fontSize={8} tickLine={false} />
                  <YAxis domain={[0, 14]} stroke="#444" fontSize={8} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="step" dataKey="drsA" name={nameA} stroke={colorA} fill="rgba(34,197,94,0.12)" strokeWidth={1} />
                  <Area type="step" dataKey="drsB" name={nameB} stroke={colorB} fill="transparent" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
