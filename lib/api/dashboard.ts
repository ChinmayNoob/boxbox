import * as jolpica from "@/lib/api/jolpica";
import * as openf1 from "@/lib/api/openf1";
import type {
  DashboardData,
  DriverStandingRow,
  OpenF1Driver,
  OpenF1Session,
  SeasonValue,
  TeamPair,
  TeamStandingRow,
} from "@/types/api";

const OPENF1_FALLBACK_YEAR = 2023;

const TEAM_COLORS: Record<string, string> = {
  "Red Bull": "#3671C6",
  "Red Bull Racing": "#3671C6",
  McLaren: "#FF8000",
  Ferrari: "#E8002D",
  Mercedes: "#27F4D2",
  "Aston Martin": "#229971",
  "Aston Martin Aramco Mercedes": "#229971",
  "Alpine F1 Team": "#FF87BC",
  Alpine: "#FF87BC",
  Williams: "#64C4FF",
  "RB F1 Team": "#6692FF",
  "Racing Bulls": "#6692FF",
  "Kick Sauber": "#52E252",
  "Stake F1 Team Kick Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD",
  Audi: "#C0C0C0",
  "Cadillac F1 Team": "#1d6d37",
};

export function getTeamColor(teamName: string): string {
  return TEAM_COLORS[teamName] ?? "#f41d00";
}

function pickSession(sessions: OpenF1Session[]): OpenF1Session | null {
  if (sessions.length === 0) return null;
  const raceSessions = sessions.filter((s) => s.session_type === "Race");
  if (raceSessions.length > 0) return raceSessions[raceSessions.length - 1];
  return sessions[sessions.length - 1] ?? null;
}

function enrichWithOpenF1Meta(
  rows: DriverStandingRow[],
  openF1Drivers: OpenF1Driver[],
): DriverStandingRow[] {
  const byAcronym = new Map(
    openF1Drivers.map((d) => [d.name_acronym, d] as const),
  );
  return rows.map((row) => {
    const d = byAcronym.get(row.code);
    const team = d?.team_name ?? row.team;
    return {
      ...row,
      driverNumber: d?.driver_number,
      team,
      teamColor: d?.team_colour ? `#${d.team_colour}` : getTeamColor(team),
    };
  });
}

function groupByTeam(rows: DriverStandingRow[]): TeamPair[] {
  const byTeam = new Map<string, DriverStandingRow[]>();
  for (const row of rows) {
    const key = row.team.trim();
    const list = byTeam.get(key) ?? [];
    list.push(row);
    byTeam.set(key, list);
  }
  return Array.from(byTeam.entries())
    .map(([team, drivers]) => {
      const sorted = drivers.sort((a, b) => a.position - b.position).slice(0, 2);
      return {
        team,
        drivers: sorted,
        points: sorted.reduce((s, d) => s + d.points, 0),
        teamColor: sorted[0]?.teamColor ?? getTeamColor(team),
      };
    })
    .sort((a, b) => b.points - a.points);
}

export async function getDashboardData(
  season: SeasonValue,
  openF1Year: SeasonValue,
): Promise<DashboardData> {
  const [races, driverStandingsRaw, constructorStandingsRaw, raceResults] =
    await Promise.all([
      jolpica.getRaces(season),
      jolpica.getDriverStandings(season),
      jolpica.getConstructorStandings(season),
      jolpica.getRaceResults(season),
    ]);

  const baseDriverRows: DriverStandingRow[] = driverStandingsRaw.map((item) => ({
    driverId: item.Driver.driverId,
    code: item.Driver.code ?? item.Driver.familyName.slice(0, 3).toUpperCase(),
    fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
    team: item.Constructors[0]?.name ?? "Unknown",
    points: Number(item.points) || 0,
    wins: Number(item.wins) || 0,
    position: Number(item.position) || 99,
    teamColor: getTeamColor(item.Constructors[0]?.name ?? "Unknown"),
  }));

  const constructorRows: TeamStandingRow[] = constructorStandingsRaw.map((item) => ({
    constructorId: item.Constructor.constructorId,
    name: item.Constructor.name,
    points: Number(item.points) || 0,
    wins: Number(item.wins) || 0,
    position: Number(item.position) || 99,
  }));

  let sessions = await openf1.getSessions(openF1Year);
  let effectiveOpenF1Year = openF1Year;
  let usedOpenF1Fallback = false;

  if (sessions.length === 0 && openF1Year !== OPENF1_FALLBACK_YEAR) {
    sessions = await openf1.getSessions(OPENF1_FALLBACK_YEAR);
    effectiveOpenF1Year = OPENF1_FALLBACK_YEAR;
    usedOpenF1Fallback = true;
  }

  const selectedSession = pickSession(sessions);

  const [drivers, positions, laps, weather, stints, intervals] = selectedSession
    ? await Promise.all([
        openf1.getDrivers(selectedSession.session_key),
        openf1.getPositions(selectedSession.session_key),
        openf1.getLaps(selectedSession.session_key),
        openf1.getWeather(selectedSession.session_key),
        openf1.getStints(selectedSession.session_key),
        openf1.getIntervals(selectedSession.session_key),
      ])
    : [[], [], [], [], [], []];

  const driverRows = enrichWithOpenF1Meta(baseDriverRows, drivers);
  const teamPairs = groupByTeam(driverRows);

  const topDriver = driverRows[0];
  const topConstructor = constructorRows[0];
  const latestRace = races[races.length - 1];

  const avgTrackTemp =
    weather.length > 0
      ? Math.round(
          weather.reduce((s, w) => s + w.track_temperature, 0) / weather.length,
        )
      : null;

  return {
    requestedSeason: season,
    requestedOpenF1Year: openF1Year,
    effectiveOpenF1Year,
    usedOpenF1Fallback,
    sessions,
    selectedSession,
    drivers,
    positions,
    laps,
    weather,
    stints,
    intervals,
    races,
    raceResults,
    driverStandings: driverRows,
    constructorStandings: constructorRows,
    teamPairs,
    kpis: {
      seasonLeader: topDriver?.code ?? "N/A",
      seasonLeaderPoints: topDriver?.points ?? 0,
      topConstructor: topConstructor?.name ?? "N/A",
      topConstructorPoints: topConstructor?.points ?? 0,
      scheduledRaces: races.length,
      completedRaces: raceResults.length,
      latestCircuitName: latestRace?.Circuit?.circuitName ?? "N/A",
      avgTrackTemp,
    },
  };
}
