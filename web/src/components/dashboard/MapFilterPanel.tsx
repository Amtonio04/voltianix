import { useMemo } from 'react';
import type { Vehicle, VehicleStatus, VehicleType, BatteryLevel, ColorCategory } from '../../types/vehicle';
import { getBatteryLevel } from '../../types/vehicle';

interface MapFilterPanelProps {
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

export default function MapFilterPanel({ vehicles, activeCategory, onCategoryChange }: MapFilterPanelProps) {
  const totalCount = vehicles.length;

  const statusCounts = useMemo(() => {
    const counts: Record<VehicleStatus, number> = { 'en-ruta': 0, 'cargando': 0, 'mantenimiento': 0 };
    vehicles.forEach((vehicle) => counts[vehicle.status]++);
    return counts;
  }, [vehicles]);

  const batteryCounts = useMemo(() => {
    const counts: Record<BatteryLevel, number> = { high: 0, medium: 0, low: 0 };
    vehicles.forEach((vehicle) => counts[getBatteryLevel(vehicle.battery)]++);
    return counts;
  }, [vehicles]);

  const typeCounts = useMemo(() => {
    const counts: Record<VehicleType, number> = { automovil: 0, van: 0, camion: 0, motocicleta: 0 };
    vehicles.forEach((vehicle) => counts[vehicle.type]++);
    return counts;
  }, [vehicles]);

  const isStatus = activeCategory === 'status';
  const isBattery = activeCategory === 'battery';
  const isType = activeCategory === 'type';

  return (
    <div className="w-72 bg-white rounded-[28px] border border-[#E6E6E6] shadow-sm overflow-hidden">
      <div className="px-4 py-4 border-b border-[#E6E6E6]">
        <p className="text-sm font-semibold text-[#1E1E1E]">Unidades Activas</p>
        <p className="text-sm text-[#616161]">{totalCount}/{totalCount}</p>
      </div>

      <CategorySection
        title="Estado Operativo"
        active={isStatus}
        onClick={() => onCategoryChange(isStatus ? null : 'status')}
      >
        {statusOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={statusCounts[option.key]}
            active={isStatus}
          />
        ))}
      </CategorySection>

      <CategorySection
        title="Nivel de Batería"
        active={isBattery}
        onClick={() => onCategoryChange(isBattery ? null : 'battery')}
      >
        {batteryOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={batteryCounts[option.key]}
            active={isBattery}
          />
        ))}
      </CategorySection>

      <CategorySection
        title="Tipo de Unidad"
        active={isType}
        onClick={() => onCategoryChange(isType ? null : 'type')}
        noBorder
      >
        {typeOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={typeCounts[option.key]}
            active={isType}
          />
        ))}
      </CategorySection>
    </div>
  );
}

function CategorySection({
  title,
  active,
  onClick,
  noBorder,
  children,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  noBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#E6E6E6] last:border-none" style={{ borderBottom: noBorder ? 'none' : undefined }}>
      <button
        type="button"
        onClick={onClick}
        className="w-full px-4 py-3 flex items-center gap-2 justify-between text-left hover:bg-[#F7F7F7] transition-colors"
      >
        <span className={`text-sm font-semibold ${active ? 'text-[#1E1E1E]' : 'text-[#616161]'}`}>{title}</span>
        <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${active ? 'text-[#1E1E1E]' : 'text-[#AFAFAF]'}`}>
          {active ? 'Activo' : 'Ver'}
        </span>
      </button>
      <div className="px-4 pb-3 space-y-2">
        {children}
      </div>
    </div>
  );
}

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
    <div className="flex items-center gap-2 text-sm text-[#616161]">
      {dotColor && (
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active ? dotColor : '#D1D5DB' }} />
      )}
      <span className={active ? 'text-[#1E1E1E]' : 'text-[#9CA3AF]' }>{label}</span>
      <span className="ml-auto font-semibold text-[#616161]">{count}</span>
    </div>
  );
}
