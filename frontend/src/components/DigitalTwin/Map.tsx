import React from 'react';
import { MapContainer, TileLayer, Circle, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Zone {
    id: string;
    name: string;
    type: string;
    coordinates: { lat: number; lon: number };
    area_km2: number;
    building_density: number;
    traffic_intensity: number;
    green_coverage: number;
}

interface MapProps {
    zones: Zone[];
}

const Map: React.FC<MapProps> = ({ zones }) => {
    // Anand Vihar Coordinates
    const center = { lat: 28.6469, lon: 77.3160 };

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-700 relative z-0">
            <MapContainer
                center={[center.lat, center.lon]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Dark mode overlay for map */}
                <div className="absolute inset-0 pointer-events-none mix-blend-multiply bg-slate-900 opacity-20 z-[400]"></div>

                {zones.map((zone) => {
                    // Generate pseudo-coordinates around center if not provided or static
                    // In a real app, use zone.coordinates. For now, offset them slightly based on ID/index
                    // We'll assume the backend provides valid coordinates, or we fallback to a spread
                    const lat = zone.coordinates?.lat || center.lat + (Math.random() - 0.5) * 0.02;
                    const lon = zone.coordinates?.lon || center.lon + (Math.random() - 0.5) * 0.02;

                    const color = zone.type === 'commercial' ? '#4f46e5' :
                        zone.type === 'industrial' ? '#ef4444' :
                            zone.type === 'residential' ? '#10b981' : '#f59e0b';

                    return (
                        <Circle
                            key={zone.id}
                            center={[lat, lon]}
                            pathOptions={{ color: color, fillColor: color, fillOpacity: 0.4 }}
                            radius={300 + (zone.area_km2 * 100)} // Dynamic radius
                        >
                            <Popup>
                                <div className="text-gray-900">
                                    <h3 className="font-bold">{zone.name}</h3>
                                    <p className="text-sm capitalize">Type: {zone.type}</p>
                                    <p className="text-xs">Density: {zone.building_density}</p>
                                    <p className="text-xs">Traffic: {zone.traffic_intensity}</p>
                                </div>
                            </Popup>
                            <Tooltip sticky>{zone.name}</Tooltip>
                        </Circle>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default Map;
