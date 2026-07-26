export interface Airport {
  icao: string;
  iata: string | null;
  name: string;
  municipality: string;
  //todo rework to be one property
  country: string;
  iso: string;
  lat: number;
  lon: number;
}
