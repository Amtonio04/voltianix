import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '../../types/vehicle';
import { getStatusColor } from '../../types/vehicle';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: (vehicle: Vehicle) => void;
}

function createMarkerIcon(vehicle: Vehicle, isSelected: boolean) {
  const color = getStatusColor(vehicle.status);
  const scale = isSelected ? 1.1 : 1;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        transform: scale(${scale});
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
        z-index: ${isSelected ? 1000 : 1};
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          background: ${color};
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Poppins', system-ui, sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px ${color}40;
          border: 2px solid rgba(255, 255, 255, 0.9);
          letter-spacing: 0.02em;
        ">
          ${vehicle.label}
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${color};
          margin: -1px auto 0;
        "></div>
      </div>
    `,
    iconSize: [76, 40],
    iconAnchor: [38, 40],
    popupAnchor: [0, -40],
  });
}

export default function VehicleMarker({ vehicle, isSelected, onClick }: VehicleMarkerProps) {
  return (
    <Marker
      position={[vehicle.location.lat, vehicle.location.lng]}
      icon={createMarkerIcon(vehicle, isSelected)}
      eventHandlers={{
        click: () => onClick(vehicle),
      }}
    />
  );
}
