import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    legacyId: v.number(),
    name: v.string(),
    slug: v.string(),
    fullName: v.string(),
    description: v.string(),
    base: v.string(),
    homeRace: v.string(),
    teamChief: v.string(),
    technicalChief: v.string(),
    chassis: v.string(),
    chassisImage: v.string(),
    chassisRenderImage: v.string(),
    powerUnit: v.string(),
    firstTeamEntry: v.string(),
    worldChampionship: v.string(),
    highestRaceFinish: v.string(),
    polePosition: v.string(),
    fastestLaps: v.string(),
    logo: v.string(),
    logoWithName: v.string(),
    basePoints: v.number(),
    points: v.number(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_slug", ["slug"]),

  drivers: defineTable({
    legacyId: v.number(),
    teamId: v.id("teams"),
    name: v.string(),
    slug: v.string(),
    fullName: v.string(),
    raceNumber: v.string(),
    country: v.string(),
    countryFlag: v.string(),
    podiums: v.string(),
    wins: v.string(),
    careerPoints: v.string(),
    grandsPrixEntered: v.string(),
    worldChampionships: v.string(),
    highestRaceFinish: v.string(),
    highestGridPosition: v.string(),
    dateOfBirth: v.string(),
    age: v.string(),
    placeOfBirth: v.string(),
    helmetImage: v.string(),
    driverImage: v.string(),
    homeRace: v.string(),
    basePoints: v.number(),
    points: v.number(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_slug", ["slug"])
    .index("by_team", ["teamId"]),

  races: defineTable({
    legacyId: v.number(),
    name: v.string(),
    slug: v.string(),
    fullName: v.string(),
    circuit: v.string(),
    country: v.string(),
    countryFlag: v.string(),
    circuitLogo: v.string(),
    circuitImage: v.string(),
    generalDate: v.string(),
    firstGrandPrix: v.string(),
    numberOfLaps: v.string(),
    circuitLength: v.string(),
    raceDistance: v.string(),
    lapRecord: v.string(),
    driverLapRecord: v.string(),
    status: v.union(
      v.literal("end"),
      v.literal("onGoing"),
      v.literal("notStarted"),
    ),
    podiumDriverIds: v.array(v.id("drivers")),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_slug", ["slug"]),

  raceResults: defineTable({
    raceId: v.id("races"),
    driverId: v.id("drivers"),
    teamId: v.id("teams"),
    position: v.number(),
    pointsAwarded: v.number(),
  })
    .index("by_race", ["raceId"])
    .index("by_driver", ["driverId"])
    .index("by_team", ["teamId"])
    .index("by_race_position", ["raceId", "position"]),
});
