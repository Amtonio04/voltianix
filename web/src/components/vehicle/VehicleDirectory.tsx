import { useEffect, useMemo, useState } from 'react';
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
  const [highlightedVehicleId, setHighlightedVehicleId] = useState<string | null>(null);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setHighlightedVehicleId(params.get('vehicle'));
  }, []);

  useEffect(() => {
    if (!highlightedVehicleId) return;

    const timer = window.setTimeout(() => {
      const element = document.getElementById(`vehicle-card-${highlightedVehicleId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus({ preventScroll: true });
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [highlightedVehicleId, filteredVehicles]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.08),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#f4f7fb_100%)] px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-[#DCFCE7] bg-[#F0FDF4] px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">
                Monitoreo de todas las Unidades
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold text-[#1E1E1E]">Consulta y administra todas las unidades de la flota en un solo lugar.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#616161]">
                Visualiza su estado operativo, nivel de batería, ubicación, alertas y accede a información detallada para una gestión más eficiente.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-[480px] xl:max-w-[560px]">
              <SummaryCard label="En ruta" value={stats.enRuta} accent="#16A34A" />
              <SummaryCard label="Cargando" value={stats.cargando} accent="#6155F5" />
              <SummaryCard label="Mantenimiento" value={stats.mantenimiento} accent="#F17F1B" />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[32px] border border-[#E6E6E6] bg-white p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)] lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onMenuToggle={() => setActiveCategory('status')}
              className="min-w-0 lg:min-w-[320px]"
            />

            <div className="flex flex-wrap gap-2">
              {filterCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
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

        {filteredVehicles.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#D8DDE6] bg-white/80 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#1E1E1E]">No se encontraron unidades con esos filtros</p>
            <p className="mt-2 text-sm text-[#616161]">Prueba ajustando la búsqueda o activando otras categorías para ver más resultados.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehiclePresentationCard
                key={vehicle.id}
                cardId={`vehicle-card-${vehicle.id}`}
                vehicle={vehicle}
                variant="directory"
                isHighlighted={highlightedVehicleId === vehicle.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-[20px] border border-[#E6E6E6] bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#616161] sm:text-[11px]">{label}</p>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      <p className="mt-2 text-2xl font-semibold text-[#1E1E1E] sm:mt-3 sm:text-3xl">{value}</p>
      <div className="mt-3 h-2 rounded-full bg-[#F0F0F0] sm:mt-4">
        <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: accent }} />
      </div>
    </div>
  );
}


