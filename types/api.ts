export type SeasonValue = number;

// ── Jolpica (Ergast) Types ──────────────────────────────────────────

export interface JolpicaLocation {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface JolpicaCircuit {
  circuitId: string;
  url?: string;
  circuitName: string;
  Location: JolpicaLocation;
}

export interface JolpicaRaceSchedule {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: JolpicaCircuit;
  date: string;
  time?: string;
  FirstPractice?: { date: string; time?: string };
  SecondPractice?: { date: string; time?: string };
  ThirdPractice?: { date: string; time?: string };
  SprintQualifying?: { date: string; time?: string };
  Sprint?: { date: string; time?: string };
  Qualifying?: { date: string; time?: string };
}

export interface JolpicaDriver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface JolpicaConstructor {
  constructorId: string;
  url?: string;
  name: string;
  nationality?: string;
}

export interface JolpicaDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: JolpicaDriver;
  Constructors: JolpicaConstructor[];
}

export interface JolpicaConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: JolpicaConstructor;
}

export interface JolpicaRaceResultEntry {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: JolpicaDriver;
  Constructor: JolpicaConstructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis: string; time: string };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
    AverageSpeed: { units: string; speed: string };
  };
}

export interface JolpicaRaceResult {
  season: string;
  round: string;
  raceName: string;
  Circuit: JolpicaCircuit;
  date: string;
  Results: JolpicaRaceResultEntry[];
}

export interface JolpicaSeason {
  season: string;
  url: string;
}

export interface JolpicaPitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}

export interface JolpicaLapTiming {
  number: string;
  Timings: { driverId: string; position: string; time: string }[];
}

// ── OpenF1 Types ────────────────────────────────────────────────────

export interface OpenF1Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end?: string;
  meeting_key: number;
  circuit_key?: number;
  circuit_short_name?: string;
  country_name?: string;
  country_code?: string;
  location?: string;
  year?: number;
}

export interface OpenF1Driver {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour?: string;
  first_name?: string;
  last_name?: string;
  headshot_url?: string;
  country_code?: string;
}

export interface OpenF1Position {
  date: string;
  session_key: number;
  meeting_key: number;
  driver_number: number;
  position: number;
}

export interface OpenF1Lap {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  lap_number: number;
  date_start: string;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  i1_speed?: number | null;
  i2_speed?: number | null;
  st_speed?: number | null;
  is_pit_out_lap?: boolean;
}

export interface OpenF1Weather {
  date: string;
  session_key: number;
  meeting_key: number;
  humidity: number;
  pressure: number;
  rainfall: number | boolean;
  track_temperature: number;
  wind_speed: number;
  wind_direction: number;
  air_temperature: number;
}

export interface OpenF1Stint {
  meeting_key: number;
  session_key: number;
  stint_number: number;
  driver_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
  tyre_age_at_start: number;
}

export interface OpenF1CarData {
  date: string;
  session_key: number;
  meeting_key: number;
  driver_number: number;
  speed: number;
  rpm: number;
  n_gear: number;
  throttle: number;
  brake: number;
  drs: number;
}

export interface OpenF1Interval {
  date: string;
  session_key: number;
  meeting_key: number;
  driver_number: number;
  interval: number | null;
  gap_to_leader: number | null;
}

// ── Dashboard View-Model Types ──────────────────────────────────────

export interface DriverStandingRow {
  driverId: string;
  code: string;
  fullName: string;
  team: string;
  points: number;
  wins: number;
  position: number;
  driverNumber?: number;
  teamColor?: string;
}

export interface TeamStandingRow {
  constructorId: string;
  name: string;
  points: number;
  wins: number;
  position: number;
}

export interface TeamPair {
  team: string;
  points: number;
  teamColor: string;
  drivers: DriverStandingRow[];
}

export interface DashboardKpis {
  seasonLeader: string;
  seasonLeaderPoints: number;
  topConstructor: string;
  topConstructorPoints: number;
  scheduledRaces: number;
  completedRaces: number;
  latestCircuitName: string;
  avgTrackTemp: number | null;
}

export interface DashboardData {
  requestedSeason: SeasonValue;
  requestedOpenF1Year: SeasonValue;
  effectiveOpenF1Year: SeasonValue;
  usedOpenF1Fallback: boolean;
  sessions: OpenF1Session[];
  selectedSession: OpenF1Session | null;
  drivers: OpenF1Driver[];
  positions: OpenF1Position[];
  laps: OpenF1Lap[];
  weather: OpenF1Weather[];
  stints: OpenF1Stint[];
  intervals: OpenF1Interval[];
  races: JolpicaRaceSchedule[];
  raceResults: JolpicaRaceResult[];
  driverStandings: DriverStandingRow[];
  constructorStandings: TeamStandingRow[];
  teamPairs: TeamPair[];
  kpis: DashboardKpis;
}
