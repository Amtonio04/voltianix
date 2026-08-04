import { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle, VehicleStatus, VehicleType, BatteryLevel } from '../../types/vehicle';
import { getBatteryLevel } from '../../types/vehicle';
import { mockVehicles } from '../../data/mock/vehicles';
import VehicleMarkerComponent from './VehicleMarker';
import SearchBar from '../dashboard/SearchBar';
import FilterPanel from '../dashboard/FilterPanel';
import VehicleCard from '../vehicle/VehicleCard';

/** Fly to a vehicle when selected */
function FlyToVehicle({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.flyTo([lat, lng], 15, { duration: 0.8 });
  return null;
}

/** Custom zoom controls */
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-1 animate-fade-in">
      {/* Locate button */}
      <button
        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50"
        style={{ border: '1px solid #E6E6E6', color: '#616161' }}
        title="Centrar mapa"
        aria-label="Centrar mapa"
        onClick={() => map.setView([21.8818, -102.2916], 13, { animate: true })}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
        </svg>
      </button>
      <button
        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50"
        style={{ border: '1px solid #E6E6E6', color: '#616161' }}
        title="Acercar"
        aria-label="Acercar mapa"
        onClick={() => map.zoomIn()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50"
        style={{ border: '1px solid #E6E6E6', color: '#616161' }}
        title="Alejar"
        aria-label="Alejar mapa"
        onClick={() => map.zoomOut()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
    </div>
  );
}

export default function FleetMap() {
  // ── State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const [statusFilters, setStatusFilters] = useState<Record<VehicleStatus, boolean>>({
    'en-ruta': true,
    'cargando': true,
    'mantenimiento': true,
  });
  const [batteryFilters, setBatteryFilters] = useState<Record<BatteryLevel, boolean>>({
    high: true,
    medium: true,
    low: true,
  });
  const [typeFilters, setTypeFilters] = useState<Record<VehicleType, boolean>>({
    automovil: true,
    van: true,
    camion: true,
    motocicleta: true,
  });

  // ── Filtering ──
  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter((v) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          v.label.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (!statusFilters[v.status]) return false;
      if (!batteryFilters[getBatteryLevel(v.battery)]) return false;
      if (!typeFilters[v.type]) return false;
      return true;
    });
  }, [searchQuery, statusFilters, batteryFilters, typeFilters]);

  const activeCount = filteredVehicles.length;
  const totalCount = mockVehicles.length;

  // ── Handlers ──
  const handleStatusChange = useCallback((status: VehicleStatus) => {
    setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  }, []);

  const handleBatteryChange = useCallback((level: BatteryLevel) => {
    setBatteryFilters((prev) => ({ ...prev, [level]: !prev[level] }));
  }, []);

  const handleTypeChange = useCallback((type: VehicleType) => {
    setTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const handleMarkerClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const handleViewDetails = useCallback((_vehicleId: string) => {
    // Future: navigate to vehicle detail page
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Aguascalientes, Mexico center
  const mapCenter: [number, number] = [21.8818, -102.2916];

  return (
    <div className="relative w-full h-full">
      {/* ── Map ── */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {filteredVehicles.map((vehicle) => (
          <VehicleMarkerComponent
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicle?.id === vehicle.id}
            onClick={handleMarkerClick}
          />
        ))}

        {selectedVehicle && (
          <FlyToVehicle
            lat={selectedVehicle.location.lat}
            lng={selectedVehicle.location.lng}
          />
        )}

        <ZoomControls />
      </MapContainer>

      {/* ── Left sidebar: Search + Filters ── */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3 max-h-[calc(100%-2rem)] overflow-y-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onMenuToggle={toggleFilters} />

        {showFilters && (
          <FilterPanel
            activeCount={activeCount}
            totalCount={totalCount}
            vehicles={mockVehicles}
            statusFilters={statusFilters}
            batteryFilters={batteryFilters}
            typeFilters={typeFilters}
            onStatusChange={handleStatusChange}
            onBatteryChange={handleBatteryChange}
            onTypeChange={handleTypeChange}
          />
        )}
      </div>

      {/* ── Vehicle card: floats on map ── */}
      {selectedVehicle && (
        <div className="absolute top-4 left-[320px] z-[1000]">
          <VehicleCard
            vehicle={selectedVehicle}
            onClose={handleCloseCard}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}
    </div>
  );
}
