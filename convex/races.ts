import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { F1_POINTS_BY_POSITION, sumPointsByDriver } from "./f1Data";

function sumPointsByTeam(
  results: Array<{
    teamId: Id<"teams">;
    pointsAwarded: number;
  }>,
): Map<Id<"teams">, number> {
  const pointsByTeam = new Map<Id<"teams">, number>();
  for (const result of results) {
    const current = pointsByTeam.get(result.teamId) ?? 0;
    pointsByTeam.set(result.teamId, current + result.pointsAwarded);
  }
  return pointsByTeam;
}

export const updateRace = mutation({
  args: {
    raceId: v.id("races"),
    top10DriverIds: v.array(v.id("drivers")),
  },
  handler: async (ctx, args) => {
    if (args.top10DriverIds.length !== 10) {
      throw new Error("top10DriverIds must contain exactly 10 drivers.");
    }

    const uniqueDriverIds = new Set(args.top10DriverIds);
    if (uniqueDriverIds.size !== args.top10DriverIds.length) {
      throw new Error("top10DriverIds must not contain duplicate drivers.");
    }

    const race = await ctx.db.get(args.raceId);
    if (!race) {
      throw new Error("Race not found.");
    }

    const rankedDrivers = await Promise.all(
      args.top10DriverIds.map(async (driverId, index) => {
        const driver = await ctx.db.get(driverId);
        if (!driver) {
          throw new Error(`Driver not found: ${driverId}`);
        }
        return {
          driver,
          position: index + 1,
          pointsAwarded: F1_POINTS_BY_POSITION[index] ?? 0,
        };
      }),
    );

    const previousResults = await ctx.db
      .query("raceResults")
      .withIndex("by_race", (q) => q.eq("raceId", args.raceId))
      .collect();

    for (const result of previousResults) {
      await ctx.db.delete(result._id);
    }

    for (const rankedDriver of rankedDrivers) {
      await ctx.db.insert("raceResults", {
        raceId: args.raceId,
        driverId: rankedDriver.driver._id,
        teamId: rankedDriver.driver.teamId,
        position: rankedDriver.position,
        pointsAwarded: rankedDriver.pointsAwarded,
      });
    }

    await ctx.db.patch(race._id, {
      status: "end",
      podiumDriverIds: rankedDrivers
        .slice(0, 3)
        .map((rankedDriver) => rankedDriver.driver._id),
    });

    const [allResults, allDrivers, allTeams] = await Promise.all([
      ctx.db.query("raceResults").collect(),
      ctx.db.query("drivers").collect(),
      ctx.db.query("teams").collect(),
    ]);

    const driverPoints = sumPointsByDriver(allResults);
    for (const driver of allDrivers) {
      const racePoints = driverPoints.get(driver._id) ?? 0;
      await ctx.db.patch(driver._id, {
        points: driver.basePoints + racePoints,
      });
    }

    const teamPoints = sumPointsByTeam(allResults);
    for (const team of allTeams) {
      const racePoints = teamPoints.get(team._id) ?? 0;
      await ctx.db.patch(team._id, {
        points: team.basePoints + racePoints,
      });
    }

    return {
      ok: true,
      raceId: race._id,
      updatedPositions: rankedDrivers.length,
    };
  },
});
