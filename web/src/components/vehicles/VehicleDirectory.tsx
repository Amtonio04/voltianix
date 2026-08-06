import { useMemo, useState } from 'react';
import SearchBar from '../dashboard/SearchBar';
import FilterPanel from '../dashboard/FilterPanel';
import { useVehicles } from '../../hooks/useVehicles';
import type { BatteryLevel, ColorCategory, Vehicle, VehicleStatus, VehicleType } from '../../types/vehicle';
import { getBatteryColor, getBatteryLevel, getStatusColor, getStatusLabel, getTypeLabel } from '../../types/vehicle';

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
          {filteredVehicles.map((vehicle) => {
            const batteryLevel = getBatteryLevel(vehicle.battery);
            const batteryColor = getBatteryColor(batteryLevel);
            const statusColor = getStatusColor(vehicle.status);
            const alerts = getVehicleAlerts(vehicle);

            return (
              <article key={vehicle.id} className="rounded-[28px] border border-[#E6E6E6] bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#616161]">{vehicle.label}</p>
                    <h2 className="mt-2 text-xl font-semibold text-[#1E1E1E]">{vehicle.model}</h2>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: statusColor, backgroundColor: `${statusColor}14`, borderColor: `${statusColor}33` }}>
                    {getStatusLabel(vehicle.status)}
                  </span>
                </div>

                <div className="space-y-4 text-sm text-[#616161]">
                  <InfoRow label="Usuario" value={vehicle.driver} />
                  <InfoRow label="Tipo de unidad" value={getTypeLabel(vehicle.type)} />
                  <InfoRow label="Autonomía restante" value={`${vehicle.autonomy} km`} />
                  <InfoRow label="Última actualización" value={vehicle.lastUpdate} />

                  <div className="rounded-[20px] border border-[#E6E6E6] bg-[#F9F9F9] p-4">
                    <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#616161]">
                      <span>Batería</span>
                      <span className="font-semibold text-[#1E1E1E]">{vehicle.battery}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white shadow-sm">
                      <div className="h-full rounded-full" style={{ width: `${vehicle.battery}%`, backgroundColor: batteryColor }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-[#F9F9F9] p-4 text-sm text-[#616161]">
                  <p className="font-semibold text-[#1E1E1E]">Ubicación</p>
                  <p className="mt-1 leading-relaxed">{vehicle.location.address}</p>
                </div>

                <div className="mt-4 rounded-[24px] border border-[#E6E6E6] bg-[#F9F9F9] px-4 py-3 text-sm">
                  <p className="mb-2 font-semibold text-[#1E1E1E]">Alertas</p>
                  {alerts.length > 0 ? (
                    <ul className="space-y-2">
                      {alerts.map((alert) => (
                        <li key={alert} className="flex items-center gap-2 text-[#616161]">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#F53131]" />
                          <span>{alert}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#616161]">Sin Alertas</p>
                  )}
                </div>
              </article>
            );
          })}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[#616161]">{label}</span>
      <span className="text-sm font-semibold text-[#1E1E1E]">{value}</span>
    </div>
  );
}

function getVehicleAlerts(vehicle: Vehicle) {
  const alerts: string[] = [];
  if (vehicle.status === 'mantenimiento') {
    alerts.push('Unidad en mantenimiento');
  }
  if (vehicle.battery <= 20) {
    alerts.push('Batería crítica');
  }
  return alerts;
}
