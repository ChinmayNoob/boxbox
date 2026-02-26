import type {
  JolpicaCircuit,
  JolpicaConstructorStanding,
  JolpicaDriverStanding,
  JolpicaLapTiming,
  JolpicaPitStop,
  JolpicaRaceResult,
  JolpicaRaceSchedule,
  JolpicaSeason,
  SeasonValue,
} from "@/types/api";

const BASE = "https://api.jolpi.ca/ergast/f1";

async function fetchJolpica(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${BASE}/${path}`, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function unwrap(data: unknown, ...keys: string[]): unknown {
  let current: unknown = data;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export async function getSeasons(): Promise<JolpicaSeason[]> {
  const data = await fetchJolpica("seasons?limit=100");
  return asArray<JolpicaSeason>(unwrap(data, "MRData", "SeasonTable", "Seasons"));
}

export async function getCircuits(season: SeasonValue): Promise<JolpicaCircuit[]> {
  const data = await fetchJolpica(`${season}/circuits`);
  return asArray<JolpicaCircuit>(unwrap(data, "MRData", "CircuitTable", "Circuits"));
}

export async function getRaces(season: SeasonValue): Promise<JolpicaRaceSchedule[]> {
  const data = await fetchJolpica(`${season}/races`);
  return asArray<JolpicaRaceSchedule>(unwrap(data, "MRData", "RaceTable", "Races"));
}

export async function getRaceResults(
  season: SeasonValue,
): Promise<JolpicaRaceResult[]> {
  const data = await fetchJolpica(`${season}/results?limit=500`);
  return asArray<JolpicaRaceResult>(unwrap(data, "MRData", "RaceTable", "Races"));
}

export async function getDriverStandings(
  season: SeasonValue,
): Promise<JolpicaDriverStanding[]> {
  const data = await fetchJolpica(`${season}/driverstandings`);
  const lists = asArray<{ DriverStandings?: unknown }>(
    unwrap(data, "MRData", "StandingsTable", "StandingsLists"),
  );
  return asArray<JolpicaDriverStanding>(lists[0]?.DriverStandings);
}

export async function getConstructorStandings(
  season: SeasonValue,
): Promise<JolpicaConstructorStanding[]> {
  const data = await fetchJolpica(`${season}/constructorstandings`);
  const lists = asArray<{ ConstructorStandings?: unknown }>(
    unwrap(data, "MRData", "StandingsTable", "StandingsLists"),
  );
  return asArray<JolpicaConstructorStanding>(lists[0]?.ConstructorStandings);
}

export async function getPitStops(
  season: SeasonValue,
  round: string | number,
): Promise<JolpicaPitStop[]> {
  const data = await fetchJolpica(`${season}/${round}/pitstops?limit=100`);
  const races = asArray<{ PitStops?: unknown }>(
    unwrap(data, "MRData", "RaceTable", "Races"),
  );
  return asArray<JolpicaPitStop>(races[0]?.PitStops);
}

export async function getLapTimings(
  season: SeasonValue,
  round: string | number,
): Promise<JolpicaLapTiming[]> {
  const data = await fetchJolpica(`${season}/${round}/laps?limit=2000`);
  const races = asArray<{ Laps?: unknown }>(
    unwrap(data, "MRData", "RaceTable", "Races"),
  );
  return asArray<JolpicaLapTiming>(races[0]?.Laps);
}
