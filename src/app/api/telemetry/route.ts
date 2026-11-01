import { NextRequest, NextResponse } from "next/server";
import {
  fetchAllTelemetry,
  fetchMetArtwork,
  fetchSeismicTelemetry,
  fetchWeatherData,
  fetchWorldTime,
} from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const feed = searchParams.get("feed");
  const lat = parseFloat(searchParams.get("lat") || "18.52");
  const lon = parseFloat(searchParams.get("lon") || "73.85");
  const locationName = searchParams.get("loc") || "Pune, India";
  const artId = searchParams.get("artId")
    ? parseInt(searchParams.get("artId")!, 10)
    : undefined;

  try {
    if (feed === "seismic") {
      const data = await fetchSeismicTelemetry();
      return NextResponse.json(data);
    }

    if (feed === "art") {
      const data = await fetchMetArtwork(artId);
      return NextResponse.json(data);
    }

    if (feed === "time") {
      const data = await fetchWorldTime();
      return NextResponse.json(data);
    }

    if (feed === "weather") {
      const data = await fetchWeatherData(lat, lon, locationName);
      return NextResponse.json(data);
    }

    // Default: Return consolidated telemetry
    const consolidated = await fetchAllTelemetry(lat, lon, locationName, artId);
    return NextResponse.json(consolidated);
  } catch (error) {
    console.error("Telemetry API error:", error);
    return NextResponse.json(
      { error: "Telemetry extraction failed", details: String(error) },
      { status: 500 }
    );
  }
}
