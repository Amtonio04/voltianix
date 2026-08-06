import { useMemo, useState } from 'react';
import SearchBar from '../dashboard/SearchBar';
import FilterPanel from '../dashboard/FilterPanel';
import { useVehicles } from '../../hooks/useVehicles';
import type { BatteryLevel, ColorCategory, VehicleStatus, VehicleType } from '../../types/vehicle';
import { getBatteryLevel } from '../../types/vehicle';
import VehiclePresentationCard from './VehiclePresentationCard';

const filterCategories: { key: Exclude<ColorCategory, null>; label: string }[] = [
  { key: 'status', label: 'Estado Operativo' },
  { key: 'battery', label: 'Nivel de Batería' },
  { key: 'type', label: 'Tipo de Unidad' },
];

export default function VehicleDirectory() {
  const vehicles = useVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Exclude<ColorCategory, null>>('status');
  const [selectedStatuses, setSelectedStatuses] = useState<VehicleStatus[]>(['en-ruta', 'cargando', 'mantenimiento']);
  const [selectedBatteryLevels, setSelectedBatteryLevels] = useState<BatteryLevel[]>(['high', 'medium', 'low']);
  const [selectedTypes, setSelectedTypes] = useState<VehicleType[]>(['automovil', 'van', 'camion', 'motocicleta']);

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      if (!selectedStatuses.includes(vehicle.status)) return false;
      if (!selectedBatteryLevels.includes(getBatteryLevel(vehicle.battery))) return false;
      if (!selectedTypes.includes(vehicle.type)) return false;

      const haystack = `${vehicle.label} ${vehicle.driver} ${vehicle.model} ${vehicle.location.address}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, vehicles, selectedStatuses, selectedBatteryLevels, selectedTypes]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      enRuta: vehicles.filter((vehicle) => vehicle.status === 'en-ruta').length,
      cargando: vehicles.filter((vehicle) => vehicle.status === 'cargando').length,
      mantenimiento: vehicles.filter((vehicle) => vehicle.status === 'mantenimiento').length,
    };
  }, [vehicles]);

  const toggleStatus = (status: VehicleStatus) => {
    setSelectedStatuses((current) =>
      current.includes(status) ? current.filter((item) => item !== status) : [...current, status]
    );
  };

  const toggleBatteryLevel = (level: BatteryLevel) => {
    setSelectedBatteryLevels((current) =>
      current.includes(level) ? current.filter((item) => item !== level) : [...current, level]
    );
  };

  const toggleType = (type: VehicleType) => {
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F7F7F7] px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[32px] border border-[#E6E6E6] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">Monitoreo de todas las Unidades</p>
              <h1 className="max-w-3xl text-3xl font-semibold text-[#1E1E1E]">Consulta y administra todas las unidades de la flota en un solo lugar.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#616161]">
                Visualiza su estado operativo, nivel de batería, ubicación, alertas y accede a información detallada para una gestión más eficiente.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard label="En ruta" value={stats.enRuta} accent="#16A34A" />
              <SummaryCard label="Cargando" value={stats.cargando} accent="#6155F5" />
              <SummaryCard label="Mantenimiento" value={stats.mantenimiento} accent="#F17F1B" />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[32px] border border-[#E6E6E6] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onMenuToggle={() => setActiveCategory('status')}
              className="min-w-0"
            />

            <div className="flex flex-wrap gap-3">
              {filterCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    activeCategory === category.key
                      ? 'bg-[#1E1E1E] text-white shadow-sm'
                      : 'bg-[#F2F4F7] text-[#616161] hover:bg-[#E5E7EB]'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <FilterPanel
              vehicles={vehicles}
              totalCount={vehicles.length}
              activeCount={filteredVehicles.length}
              activeCategory={activeCategory}
              selectedStatuses={selectedStatuses}
              selectedBatteryLevels={selectedBatteryLevels}
              selectedTypes={selectedTypes}
              onStatusToggle={toggleStatus}
              onBatteryToggle={toggleBatteryLevel}
              onTypeToggle={toggleType}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehiclePresentationCard key={vehicle.id} vehicle={vehicle} variant="directory" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-[24px] border border-[#E6E6E6] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#616161]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#1E1E1E]">{value}</p>
      <div className="mt-4 h-2 rounded-full bg-[#F0F0F0]">
        <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: accent }} />
      </div>
    </div>
  );
}


