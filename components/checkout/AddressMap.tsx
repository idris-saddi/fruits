"use client";

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue with Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AddressMapProps {
  lat: number;
  lng: number;
  address: string;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

// Component to update map center when coordinates change
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (location: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  
  return null;
}

export function AddressMap({ lat, lng, address, onLocationSelect }: AddressMapProps) {
  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border-2 border-gray-200 relative">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">Delivery Address</p>
              <p className="text-gray-600">{address}</p>
            </div>
          </Popup>
        </Marker>
        <MapUpdater lat={lat} lng={lng} />
        <MapClickHandler onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
