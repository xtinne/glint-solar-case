import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './Map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type WaveDataType = {
  latitude: number;
  longitude: number;
  maxWaveHeight: number;
};

function WaveHeightMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [waveData, setWaveData] = useState<WaveDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [0, 0],
        zoom: 2,
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on('load', () => {
        map.current!.on('click', handleMapClick);
      });
    }

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, []);

  const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    setLoading(true);
    setWaveData(null);

    try {
      const response = await fetch(
        `http://localhost:3000/wave-height?lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setWaveData(data);

      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].parentNode?.removeChild(markers[0]);
      }

      new mapboxgl.Marker()
        .setLngLat([data.longitude, data.latitude])
        .addTo(map.current!)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
            `<h4>Maxiumum wave height</h4><p>${data.maxWaveHeight.toFixed(
              2
            )} meters</p>`
          )
        )
        .togglePopup();
    } catch (error) {
      console.error('Error fetching wave data:', error);
      setWaveData(null);
      setError('There is no wave data available for this location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mapContainer}>
      <h1>Wave height - Tinne Jacobs</h1>
      <p>
        Click on the map to see the maximum wave height for January 1, 2019.
      </p>

      <div className={styles.map} ref={mapContainer} />

      <div className={styles.results}>
        {loading ? (
          <p>Loading wave data...</p>
        ) : waveData ? (
          <p>
            <strong>Location:</strong> {waveData.latitude.toFixed(3)},{' '}
            {waveData.longitude.toFixed(3)}
            <br />
            <strong>Maximum wave height:</strong>{' '}
            {waveData.maxWaveHeight.toFixed(2)} meters
            <br />
          </p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>
            Click on the map to see the maximum wave height for that location.
          </p>
        )}
      </div>
    </div>
  );
}

export default WaveHeightMap;
