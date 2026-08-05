import type { Vehicle } from '../../types/vehicle';
import { getStatusLabel, getStatusColor, getBatteryLevel, getBatteryColor } from '../../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClose: () => void;
  onViewDetails: (vehicleId: string) => void;
}

export default function VehicleCard({ vehicle, onClose, onViewDetails }: VehicleCardProps) {
  const batteryLevel = getBatteryLevel(vehicle.battery);
  const batteryColor = getBatteryColor(batteryLevel);

  return (
    <div
      className="w-80 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col animate-fade-in"
      style={{ border: '1px solid #E6E6E6' }}
    >
      {/* Encabezado */}
      <div className="px-4 py-3 relative" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          style={{ color: '#616161' }}
          aria-label="Cerrar tarjeta"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="font-semibold text-base pr-6" style={{ color: '#1E1E1E' }}>
          {vehicle.model}
        </h3>
      </div>

      {/* Filas de información */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        {/* Usuario */}
        <InfoRow icon={<UserIcon />} label="Usuario" value={vehicle.driver} />

        {/* Batería */}
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center">
            <BoltIcon />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Batería</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-battery-fill"
                  style={{ width: `${vehicle.battery}%`, backgroundColor: batteryColor }}
                />
              </div>
              <span className="text-sm font-medium tabular-nums" style={{ color: '#616161' }}>
                {vehicle.battery}%
              </span>
            </div>
          </div>
        </div>

        {/* Autonomía Restante */}
        <InfoRow icon={<BoltIcon />} label="Autonomía Restante" value={`${vehicle.autonomy} km`} />

        {/* Ubicación */}
        <InfoRow icon={<PinIcon />} label="Ubicación" value={vehicle.location.address} />

        {/* Actualizado hace */}
        <InfoRow icon={<ClockIcon />} label="Actualizado hace" value={vehicle.lastUpdate} />
      </div>

      {/* Pie de página */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={() => onViewDetails(vehicle.id)}
          className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: '#2563EB' }}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}

/* Componente auxiliar */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <span className="text-sm font-medium" style={{ color: '#1E1E1E' }}>{label}</span>
        <p className="text-sm mt-0.5" style={{ color: '#616161' }}>{value}</p>
      </div>
    </div>
  );
}

/* Iconos */

function UserIcon() {
  return (
    <svg className="w-5 h-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-5 h-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-5 h-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
