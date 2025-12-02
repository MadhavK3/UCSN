import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface WeatherMapProps {
    lat: number
    lon: number
    zoom?: number
    className?: string
    children?: React.ReactNode
    showUserLocation?: boolean
}

const RecenterMap: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
    const map = useMap()
    useEffect(() => {
        map.setView([lat, lon], map.getZoom())
    }, [lat, lon, map])
    return null
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, zoom = 13, className, children, showUserLocation = true }) => {
    // API Key removed from frontend. Using backend proxy.
    const BASE_URL = "http://127.0.0.1:8000/api";

    const [hotspots, setHotspots] = React.useState<any>(null);

    useEffect(() => {
        fetch(`${BASE_URL}/uhimap?area=Mumbai`)
            .then(res => res.json())
            .then(data => setHotspots(data))
            .catch(err => console.error("Failed to load UHI hotspots", err));
    }, []);

    return (
        <div className={className}>
            <MapContainer center={[lat, lon]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Standard">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Dark Mode">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.Overlay name="Temperature">
                        <TileLayer
                            url={`${BASE_URL}/temperature-tile/temp_new/{z}/{x}/{y}.png`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Precipitation">
                        <TileLayer
                            url={`${BASE_URL}/temperature-tile/precipitation_new/{z}/{x}/{y}.png`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Wind Speed">
                        <TileLayer
                            url={`${BASE_URL}/temperature-tile/wind_new/{z}/{x}/{y}.png`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Clouds">
                        <TileLayer
                            url={`${BASE_URL}/temperature-tile/clouds_new/{z}/{x}/{y}.png`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay checked name="UHI Hotspots">
                        <LayerGroup>
                            {hotspots && hotspots.features && hotspots.features.map((feature: any, idx: number) => (
                                <CircleMarker
                                    key={idx}
                                    center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                    pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.5 }}
                                    radius={20}
                                >
                                    <Popup>
                                        <strong>{feature.properties.zone}</strong><br />
                                        Temp: {feature.properties.temp}°C<br />
                                        Type: {feature.properties.type}
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

                {showUserLocation && (
                    <Marker position={[lat, lon]}>
                        <Popup>
                            Current Location <br /> {lat.toFixed(4)}, {lon.toFixed(4)}
                        </Popup>
                    </Marker>
                )}

                {children}

                <RecenterMap lat={lat} lon={lon} />
            </MapContainer>
        </div>
    )
}

export default WeatherMap
