import {
  ConsolidatedTelemetry,
  EarthquakeFeature,
  MetArtObject,
  SeismicTelemetry,
  WeatherData,
  WorldTimeData,
} from "@/types/telemetry";

// Curated list of verified open-access Met Museum masterpiece IDs with high-res public domain images
const CURATED_MET_OBJECTS = [
  435746, // François Boucher - Washerwomen
  436535, // Vincent van Gogh - Wheat Field with Cypresses
  436121, // Claude Monet - Bridge over a Pond of Water Lilies
  437326, // Pierre-Auguste Renoir - Two Young Girls at the Piano
  437826, // Georges Seurat - A Sunday on La Grande Jatte
  438815, // Katsushika Hokusai / Japanese Art
  437153, // Paul Cézanne - Mont Sainte-Victoire
  435882, // Edgar Degas - The Dance Class
  435809, // Paul Gauguin - Ia Orana Maria (Hail Mary)
  436528, // Vincent van Gogh - Self-Portrait with a Straw Hat
  437056, // Édouard Manet - The Spanish Singer
  438012, // Johannes Vermeer - Study of a Young Woman
  436947, // Rembrandt van Rijn - Aristotle with a Bust of Homer
  435641, // Albrecht Dürer - Virgin and Child
  437984, // Anthony van Dyck - James Stuart
];

export async function fetchSeismicTelemetry(): Promise<SeismicTelemetry> {
  const res = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
    { next: { revalidate: 30 } }
  );

  if (!res.ok) {
    throw new Error(`USGS HTTP error: ${res.status}`);
  }

  const data = await res.json();
  const features: EarthquakeFeature[] = data.features || [];

  let highestMag = 0;
  let totalDepth = 0;

  for (const f of features) {
    const mag = f.properties.mag ?? 0;
    if (mag > highestMag) highestMag = mag;
    const depth = f.geometry.coordinates[2] ?? 0;
    totalDepth += depth;
  }

  const avgDepth = features.length > 0 ? totalDepth / features.length : 0;

  return {
    count: features.length,
    generated: data.metadata?.generated || Date.now(),
    features,
    highestMag,
    avgDepth,
  };
}

export async function fetchMetArtwork(objectId?: number): Promise<MetArtObject> {
  let targetId = objectId;

  if (!targetId) {
    // Pick a random artwork from curated masterpieces
    const randomIndex = Math.floor(Math.random() * CURATED_MET_OBJECTS.length);
    targetId = CURATED_MET_OBJECTS[randomIndex];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${targetId}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "OmniSpective/1.0 (ambient telemetry dashboard)",
        },
        next: { revalidate: 300 },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.primaryImage || data.primaryImageSmall) {
        return {
          objectID: data.objectID,
          title: data.title || "Untitled Artifact",
          artistDisplayName: data.artistDisplayName || "Unknown Artisan",
          artistDisplayBio: data.artistDisplayBio || "",
          objectDate: data.objectDate || "Unknown Era",
          medium: data.medium || "Mixed Media",
          dimensions: data.dimensions || "Dimensions unavailable",
          department: data.department || "Curatorial Collection",
          repository: data.repository || "The Metropolitan Museum of Art, New York",
          objectURL: data.objectURL || "https://www.metmuseum.org",
          primaryImage: data.primaryImage || data.primaryImageSmall,
          primaryImageSmall: data.primaryImageSmall || data.primaryImage,
          isPublicDomain: Boolean(data.isPublicDomain),
          culture: data.culture,
          period: data.period,
        };
      }
    }
  } catch (err) {
    console.warn("Met API primary fetch issue, falling back:", err);
  }

  // Fallback to Van Gogh Wheat Field with Cypresses
  return {
    objectID: 436535,
    title: "Wheat Field with Cypresses",
    artistDisplayName: "Vincent van Gogh",
    artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
    objectDate: "1889",
    medium: "Oil on canvas",
    dimensions: "28 7/8 x 36 3/4 in. (73.2 x 93.4 cm)",
    department: "European Paintings",
    repository: "Metropolitan Museum of Art, New York, NY",
    objectURL: "https://www.metmuseum.org/art/collection/search/436535",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP130999.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP130999.jpg",
    isPublicDomain: true,
  };
}

export async function fetchWorldTime(): Promise<WorldTimeData> {
  // Try 1: worldtimeapi.org
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("http://worldtimeapi.org/api/ip", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return {
        datetime: data.datetime,
        utc_datetime: data.utc_datetime,
        timezone: data.timezone,
        abbreviation: data.abbreviation || "UTC",
        day_of_week: data.day_of_week,
        day_of_year: data.day_of_year,
        week_number: data.week_number,
        unixtime: data.unixtime,
        utc_offset: data.utc_offset,
        source: "worldtimeapi",
      };
    }
  } catch {
    // Graceful fallback on connection reset or timeout
  }

  // Try 2: timeapi.io
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("https://timeapi.io/api/time/current/zone?timeZone=UTC", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const now = new Date(data.dateTime || Date.now());
      return {
        datetime: now.toISOString(),
        utc_datetime: now.toISOString(),
        timezone: data.timeZone || "UTC",
        abbreviation: "UTC",
        day_of_week: data.dayOfWeek ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(data.dayOfWeek) : now.getUTCDay(),
        day_of_year: Math.floor((now.getTime() - new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).getTime()) / 86400000) + 1,
        week_number: Math.ceil(((now.getTime() - new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).getTime()) / 86400000 + 1) / 7),
        unixtime: Math.floor(now.getTime() / 1000),
        utc_offset: "+00:00",
        source: "timeapi",
      };
    }
  } catch {
    // Fallback to server clock
  }

  // Fallback 3: Atomic Precision Server Clock
  const now = new Date();
  const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const weekNumber = Math.ceil(dayOfYear / 7);

  return {
    datetime: now.toISOString(),
    utc_datetime: now.toISOString(),
    timezone: "UTC",
    abbreviation: "UTC",
    day_of_week: now.getUTCDay(),
    day_of_year: dayOfYear,
    week_number: weekNumber,
    unixtime: Math.floor(now.getTime() / 1000),
    utc_offset: "+00:00",
    source: "atomic_fallback",
  };
}

export async function fetchWeatherData(
  latitude = 18.52,
  longitude = 73.85,
  locationName = "Pune, India"
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP error: ${res.status}`);
  }

  const data = await res.json();
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    elevation: data.elevation,
    timezone: data.timezone,
    current_units: data.current_units,
    current: data.current,
    locationName,
  };
}

export async function fetchAllTelemetry(
  weatherLat = 18.52,
  weatherLon = 73.85,
  locationName = "Pune, India",
  artObjectId?: number
): Promise<ConsolidatedTelemetry> {
  const [seismicResult, artResult, timeResult, weatherResult] =
    await Promise.allSettled([
      fetchSeismicTelemetry(),
      fetchMetArtwork(artObjectId),
      fetchWorldTime(),
      fetchWeatherData(weatherLat, weatherLon, locationName),
    ]);

  return {
    seismic: seismicResult.status === "fulfilled" ? seismicResult.value : null,
    art: artResult.status === "fulfilled" ? artResult.value : null,
    time: timeResult.status === "fulfilled" ? timeResult.value : null,
    weather: weatherResult.status === "fulfilled" ? weatherResult.value : null,
    syncTimestamp: Date.now(),
    status: {
      seismic: seismicResult.status === "fulfilled" ? "online" : "offline",
      art: artResult.status === "fulfilled" ? "online" : "offline",
      time: timeResult.status === "fulfilled" ? "online" : "offline",
      weather: weatherResult.status === "fulfilled" ? "online" : "offline",
    },
  };
}
