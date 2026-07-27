import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CentreMap({ centres }) {
  const points = centres.filter((c) => c.lat && c.lng);
  return (
    <div className="orbital overflow-hidden soft-shadow border border-border/60 h-[420px]">
      <MapContainer center={[3.139, 101.6869]} zoom={10} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {points.map((c) => (
          <CircleMarker
            key={c.id || c.name}
            center={[c.lat, c.lng]}
            radius={10}
            pathOptions={{ color: "#2E7D32", fillColor: "#2E7D32", fillOpacity: 0.7, weight: 2 }}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.address}
              <br />
              {(c.materials || []).join(", ")}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}