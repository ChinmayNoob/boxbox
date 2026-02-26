import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getDashboardData } from "@/lib/api/dashboard";

type DashboardPageProps = {
  searchParams?: Promise<{
    season?: string;
    openf1Year?: string;
  }>;
};

const DEFAULT_SEASON = 2024;
const DEFAULT_OPENF1_YEAR = 2024;

function toValidYear(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const season = toValidYear(params.season, DEFAULT_SEASON);
  const openf1Year = toValidYear(params.openf1Year, DEFAULT_OPENF1_YEAR);
  const dashboardData = await getDashboardData(season, openf1Year);

  return (
    <DashboardShell
      session={dashboardData.selectedSession}
      usedFallback={dashboardData.usedOpenF1Fallback}
      effectiveYear={dashboardData.effectiveOpenF1Year}
      requestedYear={openf1Year}
    >
      <DashboardClient data={dashboardData} />
    </DashboardShell>
  );
}
