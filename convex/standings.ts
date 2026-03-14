import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

function buildTeamMap(teams: Array<Doc<"teams">>): Map<Id<"teams">, Doc<"teams">> {
  return new Map(teams.map((team) => [team._id, team]));
}

async function buildPodiumPayload(ctx: QueryCtx, race: Doc<"races">) {
  const teamById = buildTeamMap(await ctx.db.query("teams").collect());
  const podiumDrivers = await Promise.all(
    race.podiumDriverIds.map((driverId) => ctx.db.get(driverId)),
  );

  return podiumDrivers
    .filter((driver): driver is Doc<"drivers"> => Boolean(driver))
    .map((driver) => ({
      id: driver.legacyId,
      name: driver.name,
      fullName: driver.fullName,
      raceNumber: driver.raceNumber,
      team: teamById.get(driver.teamId)?.name ?? "Unknown Team",
      country: driver.country,
      countryFlag: driver.countryFlag,
      driverImage: driver.driverImage,
    }));
}

export const getDriversStandings = query({
  args: {},
  handler: async (ctx) => {
    const [drivers, teams] = await Promise.all([
      ctx.db.query("drivers").collect(),
      ctx.db.query("teams").collect(),
    ]);

    const teamById = buildTeamMap(teams);

    return drivers
      .map((driver) => {
        const team = teamById.get(driver.teamId);
        return {
          _id: driver._id,
          legacyId: driver.legacyId,
          name: driver.name,
          slug: driver.slug,
          fullName: driver.fullName,
          raceNumber: driver.raceNumber,
          country: driver.country,
          countryFlag: driver.countryFlag,
          driverImage: driver.driverImage,
          teamName: team?.name ?? "Unknown Team",
          teamSlug: team?.slug ?? "unknown-team",
          points: driver.points,
        };
      })
      .sort((a, b) => b.points - a.points)
      .map((driver, index) => ({ ...driver, rank: index + 1 }));
  },
});

export const getTeamsStandings = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams
      .map((team) => ({
        _id: team._id,
        legacyId: team.legacyId,
        name: team.name,
        slug: team.slug,
        fullName: team.fullName,
        logo: team.logo,
        logoWithName: team.logoWithName,
        points: team.points,
      }))
      .sort((a, b) => b.points - a.points)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  },
});

export const getRaceByIdOrSlug = query({
  args: {
    raceId: v.optional(v.id("races")),
    raceSlug: v.optional(v.string()),
    raceLegacyId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const providedArgCount = [
      args.raceId !== undefined,
      args.raceSlug !== undefined,
      args.raceLegacyId !== undefined,
    ].filter(Boolean).length;

    if (providedArgCount !== 1) {
      throw new Error(
        "Provide exactly one identifier: raceId, raceSlug, or raceLegacyId.",
      );
    }

    let race: Doc<"races"> | null = null;
    if (args.raceId) {
      race = await ctx.db.get(args.raceId);
    } else if (args.raceSlug) {
      race = await ctx.db
        .query("races")
        .withIndex("by_slug", (q) => q.eq("slug", args.raceSlug!))
        .unique();
    } else if (args.raceLegacyId !== undefined) {
      race = await ctx.db
        .query("races")
        .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.raceLegacyId!))
        .unique();
    }

    if (!race) return null;

    const results = await ctx.db
      .query("raceResults")
      .withIndex("by_race_position", (q) => q.eq("raceId", race._id))
      .collect();

    const drivers = await Promise.all(results.map((result) => ctx.db.get(result.driverId)));
    const teams = await Promise.all(results.map((result) => ctx.db.get(result.teamId)));

    const topResults = results.map((result, index) => ({
      position: result.position,
      pointsAwarded: result.pointsAwarded,
      driver: drivers[index],
      team: teams[index],
    }));

    return {
      race,
      results: topResults,
    };
  },
});

export const getScheduleCircuits = query({
  args: {},
  handler: async (ctx) => {
    const races = await ctx.db.query("races").collect();
    return races
      .map((race) => ({
        id: race.legacyId,
        name: race.name,
        slug: race.slug,
        countryFlag: race.countryFlag,
        circuitLogo: race.circuitLogo,
        generalDate: race.generalDate,
        currentStatus: race.status,
      }))
      .sort((a, b) => a.id - b.id);
  },
});

export const getCircuitBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const race = await ctx.db
      .query("races")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!race) return null;

    const podium = await buildPodiumPayload(ctx, race);

    return {
      id: race.legacyId,
      name: race.name,
      fullName: race.fullName,
      circuit: race.circuit,
      country: race.country,
      countryFlag: race.countryFlag,
      circuitLogo: race.circuitLogo,
      circuitImage: race.circuitImage,
      generalDate: race.generalDate,
      firstGrandPrix: race.firstGrandPrix,
      numberOfLaps: race.numberOfLaps,
      circuitLength: race.circuitLength,
      raceDistance: race.raceDistance,
      lapRecord: race.lapRecord,
      driverLapRecord: race.driverLapRecord,
      currentStatus: race.status,
      podium,
    };
  },
});

export const getRaceUpdateOptions = query({
  args: {},
  handler: async (ctx) => {
    const [races, drivers, teams] = await Promise.all([
      ctx.db.query("races").collect(),
      ctx.db.query("drivers").collect(),
      ctx.db.query("teams").collect(),
    ]);

    const teamById = buildTeamMap(teams);

    return {
      races: races
        .map((race) => ({
          _id: race._id,
          legacyId: race.legacyId,
          name: race.name,
          slug: race.slug,
          status: race.status,
          generalDate: race.generalDate,
        }))
        .sort((a, b) => a.legacyId - b.legacyId),
      drivers: drivers
        .map((driver) => ({
          _id: driver._id,
          legacyId: driver.legacyId,
          fullName: driver.fullName,
          raceNumber: driver.raceNumber,
          teamName: teamById.get(driver.teamId)?.name ?? "Unknown Team",
        }))
        .sort((a, b) => a.legacyId - b.legacyId),
    };
  },
});
