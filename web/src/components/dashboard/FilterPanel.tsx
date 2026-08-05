import { useMemo } from 'react';
import type { Vehicle, VehicleStatus, VehicleType, BatteryLevel, ColorCategory } from '../../types/vehicle';
import { getBatteryLevel } from '../../types/vehicle';

interface FilterPanelProps {
  vehicles: Vehicle[];
  activeCategory: ColorCategory;
  onCategoryChange: (category: ColorCategory) => void;
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

const typeOptions: { key: VehicleType; label: string; color: string }[] = [
  { key: 'automovil', label: 'Automóvil', color: '#6155F5' },
  { key: 'van', label: 'Van', color: '#45BC75' },
  { key: 'camion', label: 'Camión', color: '#F17F1B' },
  { key: 'motocicleta', label: 'Motocicleta', color: '#F5C731' },
];

export default function FilterPanel({
  vehicles,
  activeCategory,
  onCategoryChange,
}: FilterPanelProps) {
  const totalCount = vehicles.length;

  // Counts
  const statusCounts = useMemo(() => {
    const c: Record<VehicleStatus, number> = { 'en-ruta': 0, 'cargando': 0, 'mantenimiento': 0 };
    vehicles.forEach(v => c[v.status]++);
    return c;
  }, [vehicles]);

  const batteryCounts = useMemo(() => {
    const c: Record<BatteryLevel, number> = { high: 0, medium: 0, low: 0 };
    vehicles.forEach(v => c[getBatteryLevel(v.battery)]++);
    return c;
  }, [vehicles]);

  const typeCounts = useMemo(() => {
    const c: Record<VehicleType, number> = { automovil: 0, van: 0, camion: 0, motocicleta: 0 };
    vehicles.forEach(v => c[v.type]++);
    return c;
  }, [vehicles]);

  const isStatus = activeCategory === 'status';
  const isBattery = activeCategory === 'battery';
  const isType = activeCategory === 'type';

  return (
    <div
      className="w-72 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden animate-slide-in-left"
      style={{ border: '1px solid #E6E6E6' }}
    >
      {/* Unidades Activas */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <h3 className="font-semibold text-sm" style={{ color: '#1E1E1E' }}>Unidades Activas</h3>
        <span className="text-sm font-semibold tabular-nums" style={{ color: '#616161' }}>
          {totalCount}/{totalCount}
        </span>
      </div>

      {/* Estado Operativo */}
      <CategorySection
        title="Estado Operativo"
        icon={<CheckboxIcon checked={isStatus} />}
        active={isStatus}
        onClick={() => onCategoryChange(isStatus ? null : 'status')}
      >
        {statusOptions.map((opt) => (
          <FilterRow
            key={opt.key}
            label={opt.label}
            dotColor={opt.color}
            count={statusCounts[opt.key]}
            active={isStatus}
          />
        ))}
      </CategorySection>

      {/* Nivel de Batería */}
      <CategorySection
        title="Nivel de Batería"
        icon={<CheckboxIcon checked={isBattery} />}
        active={isBattery}
        onClick={() => onCategoryChange(isBattery ? null : 'battery')}
      >
        {batteryOptions.map((opt) => (
          <FilterRow
            key={opt.key}
            label={opt.label}
            dotColor={opt.color}
            count={batteryCounts[opt.key]}
            active={isBattery}
          />
        ))}
      </CategorySection>

      {/* Tipo de Unidad */}
      <CategorySection
        title="Tipo de Unidad"
        icon={<CheckboxIcon checked={isType} />}
        active={isType}
        onClick={() => onCategoryChange(isType ? null : 'type')}
        noBorder
      >
        {typeOptions.map((opt) => (
          <FilterRow
            key={opt.key}
            label={opt.label}
            dotColor={opt.color}
            count={typeCounts[opt.key]}
            active={isType}
          />
        ))}
      </CategorySection>
    </div>
  );
}

/* ── Section header (clickable to activate category) ── */

function CategorySection({
  title,
  icon,
  active,
  onClick,
  noBorder,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  noBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: noBorder ? 'none' : '1px solid #E6E6E6' }}>
      <div
        onClick={onClick}
        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer select-none hover:bg-gray-50 transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onClick(); } }}
      >
        {icon}
        <span
          className="text-sm font-semibold transition-colors"
          style={{ color: active ? '#1E1E1E' : '#616161' }}
        >
          {title}
        </span>
      </div>
      <div className="px-4 pb-2.5 space-y-0.5">
        {children}
      </div>
    </div>
  );
}

/* ── Filter row: shows colored dot + label + count ── */

function FilterRow({
  label,
  dotColor,
  count,
  active,
}: {
  label: string;
  dotColor?: string;
  count: number;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-0.5 px-1">
      {dotColor && (
        <span
          className="w-2 h-2 rounded-full shrink-0 transition-all"
          style={{ backgroundColor: active ? dotColor : '#AFAFAF' }}
        />
      )}
      <span
        className="flex-1 text-sm transition-colors"
        style={{ color: active ? '#1E1E1E' : '#AFAFAF' }}
      >
        {label}
      </span>
      <span
        className="text-sm tabular-nums font-medium transition-colors"
        style={{ color: active ? '#616161' : '#AFAFAF' }}
      >
        {count}
      </span>
    </div>
  );
}

/* ── Checkbox icon for section header ── */

function CheckboxIcon({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#AFAFAF" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  );
}
