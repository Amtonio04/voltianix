import type { ReactNode } from 'react';
import type { Vehicle } from '../../types/vehicle';
import { getVehicleCardViewModel } from '../../types/vehicle';

interface VehiclePresentationCardProps {
  vehicle: Vehicle;
  variant?: 'map' | 'directory';
  className?: string;
  onClose?: () => void;
  onViewDetails?: (vehicleId: string) => void;
}

export default function VehiclePresentationCard({
  vehicle,
  variant = 'directory',
  className = '',
  onClose,
  onViewDetails,
}: VehiclePresentationCardProps) {
  const { batteryColor, statusColor, statusLabel, typeLabel, alerts } = getVehicleCardViewModel(vehicle);
  const isMapVariant = variant === 'map';

  if (isMapVariant) {
    return (
      <div
        className={`w-80 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col animate-fade-in ${className}`.trim()}
        style={{ border: '1px solid #E6E6E6' }}
      >
        <div className="px-4 py-3 relative" style={{ borderBottom: '1px solid #E6E6E6' }}>
          {onClose && (
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
          )}
          <h3 className="font-semibold text-base pr-6" style={{ color: '#1E1E1E' }}>
            {vehicle.model}
          </h3>
        </div>

        <div className="px-4 py-3 flex flex-col gap-2.5">
          <InfoRow icon={<UserIcon />} label="Usuario" value={vehicle.driver} />

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

          <InfoRow icon={<BoltIcon />} label="Autonomía Restante" value={`${vehicle.autonomy} km`} />
          <InfoRow icon={<PinIcon />} label="Ubicación" value={vehicle.location.address} />
          <InfoRow icon={<ClockIcon />} label="Actualizado hace" value={vehicle.lastUpdate} />
        </div>

        {onViewDetails && (
          <div className="px-4 pb-4 pt-1">
            <button
              onClick={() => onViewDetails(vehicle.id)}
              className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: '#2563EB' }}
            >
              Ver Detalles
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <article className={`rounded-[28px] border border-[#E6E6E6] bg-white p-6 shadow-sm ${className}`.trim()}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#616161]">{vehicle.label}</p>
          <h2 className="mt-2 text-xl font-semibold text-[#1E1E1E]">{vehicle.model}</h2>
        </div>
        <span
          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: statusColor, backgroundColor: `${statusColor}14`, borderColor: `${statusColor}33` }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="space-y-4 text-sm text-[#616161]">
        <InfoRow label="Usuario" value={vehicle.driver} />
        <InfoRow label="Tipo de unidad" value={typeLabel} />
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
}

function InfoRow({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      {icon ? (
        <div className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center">{icon}</div>
      ) : null}
      <div className="flex-1">
        <span className="text-sm font-medium" style={{ color: '#1E1E1E' }}>{label}</span>
        <p className="text-sm mt-0.5" style={{ color: '#616161' }}>{value}</p>
      </div>
    </div>
  );
}

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
