"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

type SeedDriver = {
  id: number;
  name: string;
  fullName: string;
  raceNumber: string;
  team: string;
  country: string;
  countryFlag: string;
  podiums: string;
  wins: string;
  points: string;
  grandsPrixEntered: string;
  worldChampionships: string;
  highestRaceFinish: string;
  highestGridPosition: string;
  dateOfBirth: string;
  age: string;
  placeOfBirth: string;
  helmetImage: string;
  driverImage: string;
  homeRace: string;
  currentPointsDWC: number;
};

type SeedTeam = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  base: string;
  homeRace: string;
  teamChief: string;
  technicalChief: string;
  chassis: string;
  chassisImage: string;
  chassisRenderImage: string;
  powerUnit: string;
  firstTeamEntry: string;
  worldChampionship: string;
  currentPointsWC: number;
  highestRaceFinish: string;
  polePosition: string;
  fastestLaps: string;
  logo: string;
  logoWithName: string;
  drivers: SeedDriver[];
};

type SeedCircuitPodium = {
  id: number;
};

type SeedCircuit = {
  id: number;
  name: string;
  fullName: string;
  circuit: string;
  country: string;
  countryFlag: string;
  circuitLogo: string;
  circuitImage: string;
  generalDate: string;
  firstGrandPrix: string;
  numberOfLaps: string;
  circuitLength: string;
  raceDistance: string;
  lapRecord: string;
  driverLapRecord: string;
  currentStatus: "end" | "onGoing" | "notStarted";
  podium: SeedCircuitPodium[];
};

type SeedData = {
  teams: SeedTeam[];
  circuits: SeedCircuit[];
};

export const seedFromJson = action({
  args: {
    snapshot: v.any(),
  },
  handler: async (ctx, args) => {
    const parsed = args.snapshot as SeedData;
    await ctx.runMutation((internal as any).seedMutations.seedFromSnapshot, {
      snapshot: parsed,
    });

    return {
      ok: true,
      seededTeams: parsed.teams.length,
      seededRaces: parsed.circuits.length,
      seededDrivers: parsed.teams.reduce(
        (count, team) => count + team.drivers.length,
        0,
      ),
    };
  },
});
