import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";

import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

async function fetchPlaces(setIsLoading, setAvailablePlaces, setError) {
  setIsLoading(true);

  try {
    const places = await fetchAvailablePlaces();

    navigator.geolocation.getCurrentPosition((position) => {
      const sortPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortPlaces);
      setIsLoading(false);
    });
  } catch (error) {
    setIsLoading(false);
    setError({
      message: error.message || "Could not find fetch places, try again later",
    });
    throw error;
  }

  if (resData.error) {
    throw new Error(resData.error);
  }
}

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces(setIsLoading, setAvailablePlaces, setError);
  }, []);

  if (error) {
    return <ErrorPage title="An error has occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Fetching place data"
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
