import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icons not showing correctly in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = ({ source, destination }) => {
  return (
    <div className="h-96 w-full">
      <MapContainer center={[source.latitude, source.longitude]} zoom={3} style={{ height: "100%", width: "100%" }} text={3}>
        <TileLayer
          url="https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=263f3febea9e4a36bb84662431c0948b"
        />
        <Marker position={[source.latitude, source.longitude]}>
          <Popup>Source</Popup>
        </Marker>
        <Marker position={[destination.latitude, destination.longitude]}>
          <Popup>Destination</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
