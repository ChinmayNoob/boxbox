import type { Doc, Id } from "./_generated/dataModel";

export const F1_POINTS_BY_POSITION = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const;

export function toSlug(value: string): string {
  return value.trim().replaceAll(" ", "-").toLowerCase();
}

export function sumPointsByDriver(
  results: Array<Doc<"raceResults">>,
): Map<Id<"drivers">, number> {
  const pointsByDriver = new Map<Id<"drivers">, number>();
  for (const result of results) {
    const current = pointsByDriver.get(result.driverId) ?? 0;
    pointsByDriver.set(result.driverId, current + result.pointsAwarded);
  }
  return pointsByDriver;
}
