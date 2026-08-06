import { useMemo, useState } from 'react';
import SearchBar from '../dashboard/SearchBar';
import FilterPanel from '../dashboard/FilterPanel';
import { useVehicles } from '../../hooks/useVehicles';
import type { ColorCategory } from '../../types/vehicle';
import { getBatteryColor, getBatteryLevel, getStatusColor, getStatusLabel, getTypeLabel } from '../../types/vehicle';

export default function VehicleDirectory() {
  const vehicles = useVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ColorCategory>(null);
  const [showFilters, setShowFilters] = useState(true);

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return vehicles;

    return vehicles.filter((vehicle) => {
      const haystack = `${vehicle.label} ${vehicle.driver} ${vehicle.model} ${vehicle.location.address}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, vehicles]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      enRuta: vehicles.filter((vehicle) => vehicle.status === 'en-ruta').length,
      cargando: vehicles.filter((vehicle) => vehicle.status === 'cargando').length,
      mantenimiento: vehicles.filter((vehicle) => vehicle.status === 'mantenimiento').length,
    };
  }, [vehicles]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F7F7F7] px-4 py-6 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">Unidades</p>
            <h1 className="text-3xl font-semibold text-[#1E1E1E]">Gestión de la flota eléctrica</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#616161]">
              Revisa estado operativo, batería, autonomía y ubicación de cada unidad desde una vista organizada.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E6E6E6] bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-[#616161]">Unidades activas</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1E1E]">{stats.total}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard label="En ruta" value={stats.enRuta} accent="#16A34A" />
          <MetricCard label="Cargando" value={stats.cargando} accent="#6155F5" />
          <MetricCard label="Mantenimiento" value={stats.mantenimiento} accent="#F17F1B" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onMenuToggle={() => setShowFilters((value) => !value)} />
            {showFilters ? (
              <FilterPanel vehicles={vehicles} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            ) : null}
          </aside>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredVehicles.map((vehicle) => {
              const batteryLevel = getBatteryLevel(vehicle.battery);
              const batteryColor = getBatteryColor(batteryLevel);
              const statusColor = getStatusColor(vehicle.status);

              return (
                <article key={vehicle.id} className="rounded-[24px] border border-[#E6E6E6] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#616161]">{vehicle.label}</p>
                      <h2 className="mt-1 text-lg font-semibold text-[#1E1E1E]">{vehicle.model}</h2>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: statusColor, backgroundColor: `${statusColor}14` }}>
                      {getStatusLabel(vehicle.status)}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-[#616161]">
                    <InfoRow label="Conductor" value={vehicle.driver} />
                    <InfoRow label="Tipo" value={getTypeLabel(vehicle.type)} />
                    <InfoRow label="Autonomía" value={`${vehicle.autonomy} km`} />
                    <InfoRow label="Última actualización" value={vehicle.lastUpdate} />
                    <div className="pt-2">
                      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#616161]">
                        <span>Batería</span>
                        <span>{vehicle.battery}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                        <div className="h-full rounded-full" style={{ width: `${vehicle.battery}%`, backgroundColor: batteryColor }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#F9F9F9] p-3 text-sm text-[#616161]">
                    <p className="font-medium text-[#1E1E1E]">Ubicación</p>
                    <p className="mt-1">{vehicle.location.address}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-3xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#616161]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{value}</p>
      <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: `${accent}22` }}>
        <div className="h-1.5 rounded-full" style={{ width: '100%', backgroundColor: accent }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="font-medium text-[#1E1E1E]">{value}</span>
    </div>
  );
}
