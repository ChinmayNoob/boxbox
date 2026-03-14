import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { toSlug } from "./f1Data";

type SeedDriver = {
  id: number;
  name: string;
  fullName: string;
  raceNumber: string;
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
  podium: Array<{ id: number }>;
};

type SeedData = {
  teams: SeedTeam[];
  circuits: SeedCircuit[];
};

export const seedFromSnapshot = internalMutation({
  args: {
    snapshot: v.any(),
  },
  handler: async (ctx, args) => {
    const snapshot = args.snapshot as SeedData;

    const existingResults = await ctx.db.query("raceResults").collect();
    for (const result of existingResults) {
      await ctx.db.delete(result._id);
    }

    const existingDrivers = await ctx.db.query("drivers").collect();
    for (const driver of existingDrivers) {
      await ctx.db.delete(driver._id);
    }

    const existingTeams = await ctx.db.query("teams").collect();
    for (const team of existingTeams) {
      await ctx.db.delete(team._id);
    }

    const existingRaces = await ctx.db.query("races").collect();
    for (const race of existingRaces) {
      await ctx.db.delete(race._id);
    }

    const teamIdByLegacyId = new Map<number, Id<"teams">>();
    for (const team of snapshot.teams) {
      const teamId = await ctx.db.insert("teams", {
        legacyId: team.id,
        name: team.name,
        slug: toSlug(team.name),
        fullName: team.fullName,
        description: team.description,
        base: team.base,
        homeRace: team.homeRace,
        teamChief: team.teamChief,
        technicalChief: team.technicalChief,
        chassis: team.chassis,
        chassisImage: team.chassisImage,
        chassisRenderImage: team.chassisRenderImage,
        powerUnit: team.powerUnit,
        firstTeamEntry: team.firstTeamEntry,
        worldChampionship: team.worldChampionship,
        highestRaceFinish: team.highestRaceFinish,
        polePosition: team.polePosition,
        fastestLaps: team.fastestLaps,
        logo: team.logo,
        logoWithName: team.logoWithName,
        basePoints: team.currentPointsWC,
        points: team.currentPointsWC,
      });
      teamIdByLegacyId.set(team.id, teamId);
    }

    const driverIdByLegacyId = new Map<number, Id<"drivers">>();
    for (const team of snapshot.teams) {
      const teamId = teamIdByLegacyId.get(team.id);
      if (!teamId) continue;

      for (const driver of team.drivers) {
        const driverId = await ctx.db.insert("drivers", {
          legacyId: driver.id,
          teamId,
          name: driver.name,
          slug: toSlug(driver.name),
          fullName: driver.fullName,
          raceNumber: driver.raceNumber,
          country: driver.country,
          countryFlag: driver.countryFlag,
          podiums: driver.podiums,
          wins: driver.wins,
          careerPoints: driver.points,
          grandsPrixEntered: driver.grandsPrixEntered,
          worldChampionships: driver.worldChampionships,
          highestRaceFinish: driver.highestRaceFinish,
          highestGridPosition: driver.highestGridPosition,
          dateOfBirth: driver.dateOfBirth,
          age: driver.age,
          placeOfBirth: driver.placeOfBirth,
          helmetImage: driver.helmetImage,
          driverImage: driver.driverImage,
          homeRace: driver.homeRace,
          basePoints: driver.currentPointsDWC,
          points: driver.currentPointsDWC,
        });
        driverIdByLegacyId.set(driver.id, driverId);
      }
    }

    for (const circuit of snapshot.circuits) {
      const podiumDriverIds: Id<"drivers">[] = circuit.podium
        .slice(0, 3)
        .map((podiumEntry) => driverIdByLegacyId.get(podiumEntry.id))
        .filter((driverId): driverId is Id<"drivers"> => Boolean(driverId));

      await ctx.db.insert("races", {
        legacyId: circuit.id,
        name: circuit.name,
        slug: toSlug(circuit.name),
        fullName: circuit.fullName,
        circuit: circuit.circuit,
        country: circuit.country,
        countryFlag: circuit.countryFlag,
        circuitLogo: circuit.circuitLogo,
        circuitImage: circuit.circuitImage,
        generalDate: circuit.generalDate,
        firstGrandPrix: circuit.firstGrandPrix,
        numberOfLaps: circuit.numberOfLaps,
        circuitLength: circuit.circuitLength,
        raceDistance: circuit.raceDistance,
        lapRecord: circuit.lapRecord,
        driverLapRecord: circuit.driverLapRecord,
        status: circuit.currentStatus,
        podiumDriverIds,
      });
    }

    return { ok: true };
  },
});
