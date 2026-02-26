"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import type { DashboardData, JolpicaRaceResultEntry } from "@/types/api";
import Panel from "@/components/dashboard/Panel";
import SectionHeader from "@/components/dashboard/SectionHeader";
import ChartTooltip from "@/components/dashboard/ChartTooltip";

type DriverRaceStat = {
  raceName: string;
  round: string;
  grid: number;
  finish: number;
  points: number;
  status: string;
};

function driverCode(entry: JolpicaRaceResultEntry): string {
  return entry.Driver.code ?? entry.Driver.familyName.slice(0, 3).toUpperCase();
}

export default function HeadToHeadTab({ data }: { data: DashboardData }) {
  const { teamPairs, raceResults, laps, drivers } = data;

  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
  const pair = teamPairs[selectedTeamIdx];
  const driverA = pair?.drivers[0];
  const driverB = pair?.drivers[1];

  const codeA = driverA?.code ?? "";
  const codeB = driverB?.code ?? "";

  const openf1DriverA = drivers.find((d) => d.name_acronym === codeA);
  const openf1DriverB = drivers.find((d) => d.name_acronym === codeB);
  const colorA = openf1DriverA?.team_colour
    ? `#${openf1DriverA.team_colour}`
    : (driverA?.teamColor ?? "#ff8000");
  const colorB = "#00d4ff";

  // Build per-race stats for both drivers
  const raceStatsA = useMemo((): DriverRaceStat[] => {
    return raceResults.flatMap((race) => {
      const entry = race.Results.find(
        (r) => driverCode(r) === codeA || r.Driver.driverId === driverA?.driverId,
      );
      if (!entry) return [];
      return [
        {
          raceName: race.raceName.replace(" Grand Prix", ""),
          round: race.round,
          grid: parseInt(entry.grid) || 20,
          finish: parseInt(entry.position) || 20,
          points: parseFloat(entry.points) || 0,
          status: entry.status,
        },
      ];
    });
  }, [raceResults, codeA, driverA]);

  const raceStatsB = useMemo((): DriverRaceStat[] => {
    return raceResults.flatMap((race) => {
      const entry = race.Results.find(
        (r) => driverCode(r) === codeB || r.Driver.driverId === driverB?.driverId,
      );
      if (!entry) return [];
      return [
        {
          raceName: race.raceName.replace(" Grand Prix", ""),
          round: race.round,
          grid: parseInt(entry.grid) || 20,
          finish: parseInt(entry.position) || 20,
          points: parseFloat(entry.points) || 0,
          status: entry.status,
        },
      ];
    });
  }, [raceResults, codeB, driverB]);

  // Score card stats
  const stats = useMemo(() => {
    const winsA = raceStatsA.filter((r) => r.finish === 1).length;
    const winsB = raceStatsB.filter((r) => r.finish === 1).length;
    const podiumsA = raceStatsA.filter((r) => r.finish <= 3).length;
    const podiumsB = raceStatsB.filter((r) => r.finish <= 3).length;
    const avgFinA =
      raceStatsA.length > 0
        ? (
            raceStatsA.reduce((s, r) => s + r.finish, 0) / raceStatsA.length
          ).toFixed(1)
        : "—";
    const avgFinB =
      raceStatsB.length > 0
        ? (
            raceStatsB.reduce((s, r) => s + r.finish, 0) / raceStatsB.length
          ).toFixed(1)
        : "—";
    const avgQualA =
      raceStatsA.length > 0
        ? (
            raceStatsA.reduce((s, r) => s + r.grid, 0) / raceStatsA.length
          ).toFixed(1)
        : "—";
    const avgQualB =
      raceStatsB.length > 0
        ? (
            raceStatsB.reduce((s, r) => s + r.grid, 0) / raceStatsB.length
          ).toFixed(1)
        : "—";

    return { winsA, winsB, podiumsA, podiumsB, avgFinA, avgFinB, avgQualA, avgQualB };
  }, [raceStatsA, raceStatsB]);

  // Qualifying battle
  const qualBattle = useMemo(() => {
    let aAhead = 0;
    let bAhead = 0;
    const raceLabels: { race: string; diff: number }[] = [];

    for (let i = 0; i < Math.min(raceStatsA.length, raceStatsB.length); i++) {
      const gridA = raceStatsA[i].grid;
      const gridB = raceStatsB[i].grid;
      if (gridA < gridB) aAhead++;
      else if (gridB < gridA) bAhead++;
      raceLabels.push({
        race: raceStatsA[i].raceName.slice(0, 6),
        diff: gridA - gridB,
      });
    }
    return { aAhead, bAhead, raceLabels };
  }, [raceStatsA, raceStatsB]);

  // Points progression
  const pointsProgression = useMemo(() => {
    let cumA = 0;
    let cumB = 0;
    return raceResults.map((race, i) => {
      cumA += raceStatsA[i]?.points ?? 0;
      cumB += raceStatsB[i]?.points ?? 0;
      return {
        race: race.raceName.replace(" Grand Prix", "").slice(0, 6),
        [codeA]: cumA,
        [codeB]: cumB,
      };
    });
  }, [raceResults, raceStatsA, raceStatsB, codeA, codeB]);

  // Grid vs finish scatter
  const scatterA = useMemo(
    () =>
      raceStatsA.map((r) => ({
        x: r.grid,
        y: r.finish,
        z: r.points,
        label: r.raceName,
      })),
    [raceStatsA],
  );
  const scatterB = useMemo(
    () =>
      raceStatsB.map((r) => ({
        x: r.grid,
        y: r.finish,
        z: r.points,
        label: r.raceName,
      })),
    [raceStatsB],
  );

  // Lap pace distribution (box-plot style with bar chart of avg lap times per race)
  const paceComparison = useMemo(() => {
    if (laps.length === 0) return [];
    const numA = openf1DriverA?.driver_number;
    const numB = openf1DriverB?.driver_number;
    if (!numA) return [];

    const maxLap = Math.max(...laps.map((l) => l.lap_number));
    const result: { lap: number; [key: string]: number | null }[] = [];

    for (let lap = 1; lap <= Math.min(maxLap, 60); lap++) {
      const aLap = laps.find(
        (l) => l.driver_number === numA && l.lap_number === lap,
      );
      const bLap = numB
        ? laps.find((l) => l.driver_number === numB && l.lap_number === lap)
        : null;
      result.push({
        lap,
        [codeA]: aLap?.lap_duration ?? null,
        [codeB]: bLap?.lap_duration ?? null,
      });
    }
    return result;
  }, [laps, openf1DriverA, openf1DriverB, codeA, codeB]);

  const statItems = [
    { label: "Points", a: driverA?.points ?? 0, b: driverB?.points ?? 0 },
    { label: "Wins", a: stats.winsA, b: stats.winsB },
    { label: "Podiums", a: stats.podiumsA, b: stats.podiumsB },
    { label: "Avg Finish", a: stats.avgFinA, b: stats.avgFinB },
    { label: "Avg Qualifying", a: stats.avgQualA, b: stats.avgQualB },
  ];

  return (
    <div className="space-y-3">
      {/* Team selector */}
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
        <div className="flex items-center gap-4 ml-auto text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colorA }} />
            {driverA?.fullName ?? codeA}
          </span>
          <span className="text-neutral-600">vs</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colorB }} />
            {driverB?.fullName ?? codeB}
          </span>
        </div>
      </Panel>

      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {statItems.map((s) => (
          <Panel key={s.label} className="!p-2.5 text-center">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono mb-1">
              {s.label}
            </p>
            <div className="flex items-center justify-center gap-3">
              <span
                className="text-sm font-f1-bold"
                style={{ color: colorA }}
              >
                {s.a}
              </span>
              <span className="text-[10px] text-neutral-600">vs</span>
              <span
                className="text-sm font-f1-bold"
                style={{ color: colorB }}
              >
                {s.b}
              </span>
            </div>
          </Panel>
        ))}
      </div>

      {/* Qualifying Battle + Points Progression */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Panel>
          <SectionHeader
            title="Qualifying Battle"
            subtitle={`${codeA} ${qualBattle.aAhead} - ${qualBattle.bAhead} ${codeB}`}
          />
          <div className="h-[220px]">
            {qualBattle.raceLabels.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualBattle.raceLabels} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="race" stroke="#555" fontSize={8} tickLine={false} />
                  <YAxis stroke="#555" fontSize={8} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="diff" name="Grid Pos Diff" radius={[3, 3, 0, 0]}>
                    {qualBattle.raceLabels.map((e, i) => (
                      <Cell
                        key={i}
                        fill={e.diff < 0 ? colorA : e.diff > 0 ? colorB : "#666"}
                        fillOpacity={0.75}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No qualifying data
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Points Progression" subtitle="Cumulative points across races" />
          <div className="h-[220px]">
            {pointsProgression.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pointsProgression} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="race" stroke="#555" fontSize={8} tickLine={false} />
                  <YAxis stroke="#555" fontSize={8} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey={codeA}
                    name={codeA}
                    stroke={colorA}
                    strokeWidth={2}
                    dot={{ r: 2, fill: colorA }}
                  />
                  <Line
                    type="monotone"
                    dataKey={codeB}
                    name={codeB}
                    stroke={colorB}
                    strokeWidth={2}
                    dot={{ r: 2, fill: colorB }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No race data
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* Race Pace + Grid vs Finish */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-3">
        <Panel>
          <SectionHeader
            title="Race Pace Comparison"
            subtitle="Lap-by-lap timing overlay"
          />
          <div className="h-[260px]">
            {paceComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paceComparison} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="lap" stroke="#444" fontSize={8} tickLine={false} />
                  <YAxis stroke="#444" fontSize={8} tickLine={false} unit="s" domain={["auto", "auto"]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey={codeA}
                    name={codeA}
                    stroke={colorA}
                    strokeWidth={1.2}
                    dot={false}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey={codeB}
                    name={codeB}
                    stroke={colorB}
                    strokeWidth={1.2}
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No lap timing data
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            title="Grid vs Finish"
            subtitle="Positions gained / lost per race"
          />
          <div className="h-[260px]">
            {scatterA.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="x"
                    name="Grid"
                    stroke="#555"
                    fontSize={8}
                    tickLine={false}
                    label={{
                      value: "Grid",
                      position: "insideBottom",
                      offset: -2,
                      fill: "#666",
                      fontSize: 9,
                    }}
                  />
                  <YAxis
                    dataKey="y"
                    name="Finish"
                    stroke="#555"
                    fontSize={8}
                    tickLine={false}
                    reversed
                    label={{
                      value: "Finish",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#666",
                      fontSize: 9,
                    }}
                  />
                  <ZAxis dataKey="z" range={[30, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Scatter name={codeA} data={scatterA} fill={colorA} fillOpacity={0.8} />
                  <Scatter name={codeB} data={scatterB} fill={colorB} fillOpacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-600 text-xs">
                No race data
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
