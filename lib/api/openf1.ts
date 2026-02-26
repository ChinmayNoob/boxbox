import type {
  OpenF1CarData,
  OpenF1Driver,
  OpenF1Interval,
  OpenF1Lap,
  OpenF1Position,
  OpenF1Session,
  OpenF1Stint,
  OpenF1TeamRadio,
  OpenF1Weather,
  SeasonValue,
} from "@/types/api";

const BASE = "https://api.openf1.org/v1";

type QueryValue = string | number | boolean | null | undefined;

function buildQuery(params?: Record<string, QueryValue>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&")
  );
}

async function fetchOpenF1<T>(
  endpoint: string,
  params?: Record<string, QueryValue>,
): Promise<T[]> {
  try {
    const res = await fetch(`${BASE}/${endpoint}${buildQuery(params)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export async function getSessions(year: SeasonValue): Promise<OpenF1Session[]> {
  return fetchOpenF1<OpenF1Session>("sessions", { year });
}

export async function getDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
  return fetchOpenF1<OpenF1Driver>("drivers", { session_key: sessionKey });
}

export async function getPositions(sessionKey: number): Promise<OpenF1Position[]> {
  return fetchOpenF1<OpenF1Position>("position", { session_key: sessionKey });
}

export async function getLaps(sessionKey: number): Promise<OpenF1Lap[]> {
  return fetchOpenF1<OpenF1Lap>("laps", { session_key: sessionKey });
}

export async function getWeather(sessionKey: number): Promise<OpenF1Weather[]> {
  return fetchOpenF1<OpenF1Weather>("weather", { session_key: sessionKey });
}

export async function getStints(sessionKey: number): Promise<OpenF1Stint[]> {
  return fetchOpenF1<OpenF1Stint>("stints", { session_key: sessionKey });
}

export async function getIntervals(sessionKey: number): Promise<OpenF1Interval[]> {
  return fetchOpenF1<OpenF1Interval>("intervals", { session_key: sessionKey });
}

export async function getCarData(
  sessionKey: number,
  driverNumber: number,
): Promise<OpenF1CarData[]> {
  return fetchOpenF1<OpenF1CarData>("car_data", {
    session_key: sessionKey,
    driver_number: driverNumber,
  });
}

export async function getTeamRadio(
  sessionKey: number,
  driverNumber?: number,
): Promise<OpenF1TeamRadio[]> {
  return fetchOpenF1<OpenF1TeamRadio>("team_radio", {
    session_key: sessionKey,
    driver_number: driverNumber,
  });
}
