export type VehicleStatus = 'en-ruta' | 'cargando' | 'mantenimiento';
export type VehicleType = 'automovil' | 'van' | 'camion' | 'motocicleta';
export type BatteryLevel = 'high' | 'medium' | 'low';

export interface Vehicle {
  id: string;
  label: string;
  driver: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  battery: number;
  autonomy: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastUpdate: string;
}

export function getBatteryLevel(battery: number): BatteryLevel {
  if (battery >= 70) return 'high';
  if (battery >= 30) return 'medium';
  return 'low';
}

export function getStatusLabel(status: VehicleStatus): string {
  const labels: Record<VehicleStatus, string> = {
    'en-ruta': 'En Ruta',
    'cargando': 'Cargando',
    'mantenimiento': 'En Mantenimiento',
  };
  return labels[status];
}

export function getTypeLabel(type: VehicleType): string {
  const labels: Record<VehicleType, string> = {
    'automovil': 'Automóvil',
    'van': 'Van',
    'camion': 'Camión',
    'motocicleta': 'Motocicleta',
  };
  return labels[type];
}

/** Baseline status colors */
export function getStatusColor(status: VehicleStatus): string {
  const colors: Record<VehicleStatus, string> = {
    'en-ruta': '#45BC75',
    'cargando': '#6155F5',
    'mantenimiento': '#F17F1B',
  };
  return colors[status];
}

/** Baseline battery colors */
export function getBatteryColor(level: BatteryLevel): string {
  const colors: Record<BatteryLevel, string> = {
    high: '#45BC75',
    medium: '#F5C731',
    low: '#F53131',
  };
  return colors[level];
}
