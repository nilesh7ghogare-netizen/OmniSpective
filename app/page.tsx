import { fetchAllTelemetry } from "@/lib/api";
import { GlobalTelemetryGrid } from "@/components/GlobalTelemetryGrid";

export default async function Home() {
  const initialTelemetry = await fetchAllTelemetry();

  return <GlobalTelemetryGrid initialData={initialTelemetry} />;
}
