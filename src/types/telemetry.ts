export interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string;
    time: number;
    updated: number;
    url: string;
    status: string;
    tsunami: number;
    sig: number;
    magType: string;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number]; // [longitude, latitude, depth_km]
  };
}

export interface SeismicTelemetry {
  count: number;
  generated: number;
  features: EarthquakeFeature[];
  highestMag: number;
  avgDepth: number;
}

export interface MetArtObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  department: string;
  repository: string;
  objectURL: string;
  primaryImage: string;
  primaryImageSmall: string;
  isPublicDomain: boolean;
  culture?: string;
  period?: string;
}

export interface WorldTimeData {
  datetime: string;
  utc_datetime: string;
  timezone: string;
  abbreviation: string;
  day_of_week: number;
  day_of_year: number;
  week_number: number;
  unixtime: number;
  utc_offset: string;
  source: "worldtimeapi" | "timeapi" | "atomic_fallback";
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    wind_speed_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    wind_speed_10m: number;
  };
  locationName: string;
}

export interface ConsolidatedTelemetry {
  seismic: SeismicTelemetry | null;
  art: MetArtObject | null;
  time: WorldTimeData | null;
  weather: WeatherData | null;
  syncTimestamp: number;
  status: {
    seismic: "online" | "degraded" | "offline";
    art: "online" | "degraded" | "offline";
    time: "online" | "degraded" | "offline";
    weather: "online" | "degraded" | "offline";
  };
}
