"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import f1Data from "@/db/f1.json";

const POSITION_LABELS = [
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "P9",
  "P10",
] as const;

type RaceOption = {
  _id: string;
  legacyId: number;
  name: string;
  status: "end" | "onGoing" | "notStarted";
};

type DriverOption = {
  _id: string;
  fullName: string;
  raceNumber: string;
  teamName: string;
};

type RaceUpdateOptions = {
  races: RaceOption[];
  drivers: DriverOption[];
};

export default function RaceAdminPanel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convexApi = api as any;
  const options = useQuery(convexApi.standings.getRaceUpdateOptions) as
    | RaceUpdateOptions
    | undefined;
  const updateRace = useMutation(convexApi.races.updateRace);
  const seedFromJson = useAction(convexApi.seed.seedFromJson);

  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [positionDriverIds, setPositionDriverIds] = useState<string[]>(
    Array.from({ length: 10 }, () => ""),
  );
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const duplicateIds = useMemo(() => {
    const used = new Set<string>();
    const duplicates = new Set<string>();
    for (const id of positionDriverIds) {
      if (!id) continue;
      if (used.has(id)) duplicates.add(id);
      used.add(id);
    }
    return duplicates;
  }, [positionDriverIds]);

  if (!options) {
    return (
      <div className="text-neutral-300 font-f1-regular py-8">
        Loading race admin panel...
      </div>
    );
  }

  const canSubmit =
    selectedRaceId.length > 0 &&
    positionDriverIds.every((driverId) => driverId.length > 0) &&
    duplicateIds.size === 0 &&
    !isSaving;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 text-neutral-100 font-onest">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-f1-wide">Race Admin</h1>
        <button
          type="button"
          onClick={async () => {
            try {
              setIsSeeding(true);
              setStatus("Seeding from db/f1.json...");
              const result = await seedFromJson({ snapshot: f1Data });
              setStatus(
                `Seed complete: ${result.seededTeams} teams, ${result.seededDrivers} drivers, ${result.seededRaces} races.`,
              );
            } catch (error) {
              setStatus(
                `Seed failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            } finally {
              setIsSeeding(false);
            }
          }}
          className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-600 disabled:opacity-60"
          disabled={isSeeding}
        >
          {isSeeding ? "Seeding..." : "Seed from JSON"}
        </button>
      </div>

      <div className="rounded-xl border border-neutral-700 bg-neutral-900/50 p-5 space-y-5">
        <div className="space-y-2">
          <label htmlFor="race" className="block text-sm text-neutral-300">
            Race
          </label>
          <select
            id="race"
            className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
            value={selectedRaceId}
            onChange={(event) => setSelectedRaceId(event.target.value)}
          >
            <option value="">Select race...</option>
            {options.races.map((race) => (
              <option key={race._id} value={race._id}>
                #{race.legacyId} - {race.name} ({race.status})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POSITION_LABELS.map((positionLabel, index) => (
            <div key={positionLabel} className="space-y-2">
              <label
                htmlFor={`driver-${index}`}
                className="block text-sm text-neutral-300"
              >
                {positionLabel}
              </label>
              <select
                id={`driver-${index}`}
                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                value={positionDriverIds[index]}
                onChange={(event) => {
                  const next = [...positionDriverIds];
                  next[index] = event.target.value;
                  setPositionDriverIds(next);
                }}
              >
                <option value="">Select driver...</option>
                {options.drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    #{driver.raceNumber} {driver.fullName} - {driver.teamName}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {duplicateIds.size > 0 && (
          <p className="text-sm text-red-400">
            Duplicate drivers selected. Each position must have a unique driver.
          </p>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={async () => {
            try {
              setIsSaving(true);
              setStatus("Updating race...");
              await updateRace({
                raceId: selectedRaceId,
                top10DriverIds: positionDriverIds,
              });
              setStatus("Race updated successfully.");
            } catch (error) {
              setStatus(
                `Update failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            } finally {
              setIsSaving(false);
            }
          }}
          className="px-4 py-2 rounded-md bg-green-700 hover:bg-green-600 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Update Race"}
        </button>

        {status.length > 0 && (
          <p className="text-sm text-neutral-300 pt-2">{status}</p>
        )}
      </div>
    </section>
  );
}
