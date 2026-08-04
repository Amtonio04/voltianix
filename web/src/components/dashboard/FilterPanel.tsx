import { useMemo } from 'react';
import type { Vehicle, VehicleStatus, VehicleType, BatteryLevel } from '../../types/vehicle';
import { getBatteryLevel, getTypeLabel } from '../../types/vehicle';

interface FilterPanelProps {
  activeCount: number;
  totalCount: number;
  vehicles: Vehicle[];
  statusFilters: Record<VehicleStatus, boolean>;
  batteryFilters: Record<BatteryLevel, boolean>;
  typeFilters: Record<VehicleType, boolean>;
  onStatusChange: (status: VehicleStatus) => void;
  onBatteryChange: (level: BatteryLevel) => void;
  onTypeChange: (type: VehicleType) => void;
}

const statusOptions: { key: VehicleStatus; label: string; color: string }[] = [
  { key: 'en-ruta', label: 'En Ruta', color: '#45BC75' },
  { key: 'cargando', label: 'Cargando', color: '#6155F5' },
  { key: 'mantenimiento', label: 'En Mantenimiento', color: '#F17F1B' },
];

const batteryOptions: { key: BatteryLevel; label: string; color: string }[] = [
  { key: 'high', label: 'Más del 70%', color: '#45BC75' },
  { key: 'medium', label: '30% - 70%', color: '#F5C731' },
  { key: 'low', label: 'Menos del 30%', color: '#F53131' },
];

const typeOptions: { key: VehicleType; label: string }[] = [
  { key: 'automovil', label: 'Automóvil' },
  { key: 'van', label: 'Van' },
  { key: 'camion', label: 'Camión' },
  { key: 'motocicleta', label: 'Motocicleta' },
];

export default function FilterPanel({
  activeCount,
  totalCount,
  vehicles,
  statusFilters,
  batteryFilters,
  typeFilters,
  onStatusChange,
  onBatteryChange,
  onTypeChange,
}: FilterPanelProps) {
  // Count vehicles per category
  const statusCounts = useMemo(() => {
    const counts: Record<VehicleStatus, number> = { 'en-ruta': 0, 'cargando': 0, 'mantenimiento': 0 };
    vehicles.forEach(v => counts[v.status]++);
    return counts;
  }, [vehicles]);

  const batteryCounts = useMemo(() => {
    const counts: Record<BatteryLevel, number> = { high: 0, medium: 0, low: 0 };
    vehicles.forEach(v => counts[getBatteryLevel(v.battery)]++);
    return counts;
  }, [vehicles]);

  const typeCounts = useMemo(() => {
    const counts: Record<VehicleType, number> = { automovil: 0, van: 0, camion: 0, motocicleta: 0 };
    vehicles.forEach(v => counts[v.type]++);
    return counts;
  }, [vehicles]);

  return (
    <div className="w-72 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden animate-slide-in-left" style={{ border: '1px solid #E6E6E6' }}>
      {/* Unidades Activas */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <h3 className="font-semibold text-sm" style={{ color: '#1E1E1E' }}>Unidades Activas</h3>
        <span className="text-sm font-semibold tabular-nums" style={{ color: '#616161' }}>
          {activeCount}/{totalCount}
        </span>
      </div>

      {/* Estado Operativo */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>Estado Operativo</span>
        </div>
        <div className="space-y-1">
          {statusOptions.map((opt) => (
            <FilterRow
              key={opt.key}
              label={opt.label}
              dotColor={opt.color}
              count={statusCounts[opt.key]}
              checked={statusFilters[opt.key]}
              onChange={() => onStatusChange(opt.key)}
            />
          ))}
        </div>
      </div>

      {/* Nivel de Batería */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="7" width="16" height="10" rx="2" />
            <path d="M22 11v2" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>Nivel de Batería</span>
        </div>
        <div className="space-y-1">
          {batteryOptions.map((opt) => (
            <FilterRow
              key={opt.key}
              label={opt.label}
              dotColor={opt.color}
              count={batteryCounts[opt.key]}
              checked={batteryFilters[opt.key]}
              onChange={() => onBatteryChange(opt.key)}
            />
          ))}
        </div>
      </div>

      {/* Tipo de Unidad */}
      <div className="px-4 py-3">
        <div className="mb-2">
          <span className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>Tipo de Unidad</span>
        </div>
        <div className="space-y-1">
          {typeOptions.map((opt) => (
            <FilterRow
              key={opt.key}
              label={opt.label}
              count={typeCounts[opt.key]}
              checked={typeFilters[opt.key]}
              onChange={() => onTypeChange(opt.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Filter row with dot + label + count ── */

function FilterRow({
  label,
  dotColor,
  count,
  checked,
  onChange,
}: {
  label: string;
  dotColor?: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1 -mx-1 transition-colors">
      {dotColor && (
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
      )}
      {!dotColor && (
        <span className="w-2 h-2 shrink-0" />
      )}
      <span
        className="flex-1 text-sm transition-colors"
        style={{ color: checked ? '#1E1E1E' : '#616161' }}
      >
        {label}
      </span>
      <span className="text-sm tabular-nums font-medium" style={{ color: '#616161' }}>
        {count}
      </span>
    </label>
  );
}
