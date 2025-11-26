import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Vet } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    vets: Vet[];
    center?: [number, number];
}

// Component to update map center when props change
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
};

const Map: React.FC<MapProps> = ({ vets, center = [37.9838, 23.7275] }) => {
    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            {vets.map((vet) => (
                <Marker key={vet.id} position={[vet.latitude, vet.longitude]}>
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold text-sm">{vet.name}</h3>
                            <p className="text-xs text-gray-600">{vet.clinicName}</p>
                            <a href={`/vet/${vet.id}`} className="text-primary-600 text-xs hover:underline block mt-1">
                                View Profile
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
