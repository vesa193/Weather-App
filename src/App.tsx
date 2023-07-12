import { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import "./App.css";

const containerStyle = {
  width: "640px",
  height: "400px",
};

const center = {
  lat: 44.01667,
  lng: 20.91667,
};

interface Coord {
  lat: number;
  lng: number;
}

interface Location {
  id: number;
  city: string;
  coords: Coord;
  isVisible: boolean;
}

const locations: Location[] = [
  {
    id: 10,
    city: "Kragujevac",
    coords: {
      lat: 44.01667,
      lng: 20.91667,
    },
    isVisible: false,
  },
  {
    id: 11,
    city: "Beograd",
    coords: {
      lat: 44.787197,
      lng: 20.457273,
    },
    isVisible: false,
  },
  {
    id: 12,
    city: "Nis",
    coords: {
      lat: 43.3209,
      lng: 21.8954,
    },
    isVisible: false,
  },
  {
    id: 13,
    city: "Novi Sad",
    coords: {
      lat: 45.267136,
      lng: 19.833549,
    },
    isVisible: false,
  },
];

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD54y8CPsLYyK8EjqNPqT_TKaeJsKIjZR8",
  });

  const [map, setMap] = useState(null);
  const [places] = useState<Location[]>(locations || []);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<[] | null>(null);

  const onLoad = useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((location: Location) =>
      bounds.extend({ lat: location.coords.lat, lng: location.coords.lng })
    );
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleClickMarker = async (marker: any, place: Location) => {
    if (place.id) {
      map?.panTo({ lat: place.coords.lat, lng: place.coords.lng });
      setIsInfoWindowOpen(!isInfoWindowOpen);
      setSelectedPlace(place.id);
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${place.coords.lat}&lon=${place.coords.lng}&appid=8501ecd721cfaf64473c3742718a9585`
      );

      try {
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("err", error);
      }
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      {places?.map((place) => {
        return (
          <MarkerF
            key={place.id}
            position={place.coords}
            onClick={(marker) => handleClickMarker(marker, place)}
          >
            {place.id === selectedPlace && (
              <InfoWindowF
                onCloseClick={() => {
                  setIsInfoWindowOpen(false);
                  setSelectedPlace(null);
                }}
              >
                <>
                  <h5>{place.city}</h5>
                  {Object.keys(weatherData || {})?.map((temp: any) => {
                    console.log("2222", temp);
                  })}
                </>
              </InfoWindowF>
            )}
          </MarkerF>
        );
      })}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default App;
