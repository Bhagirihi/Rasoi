import * as Location from 'expo-location';

export type UserLocationSnapshot = {
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
};

export async function requestUserLocation(): Promise<UserLocationSnapshot | null> {
  if (Location.requestForegroundPermissionsAsync) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = position.coords;
  let city: string | null = null;
  let state: string | null = null;

  try {
    const places = await Location.reverseGeocodeAsync({ latitude, longitude });
    const place = places[0];
    if (place) {
      city = place.city ?? place.subregion ?? place.district ?? null;
      state = place.region ?? null;
    }
  } catch {
    // Coordinates still useful without reverse geocode.
  }

  return {
    city,
    state,
    latitude,
    longitude,
  };
}

export function formatUserLocation(city: string | null, state: string | null): string {
  if (!city && !state) return 'Location not set';
  if (city && state) return `${city}, ${state}`;
  return city ?? state ?? 'Location not set';
}
