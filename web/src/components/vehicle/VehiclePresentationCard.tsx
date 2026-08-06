import type { ReactNode } from 'react';
import type { Vehicle } from '../../types/vehicle';
import { getVehicleCardViewModel } from '../../types/vehicle';

interface VehiclePresentationCardProps {
  vehicle: Vehicle;
  variant?: 'map' | 'directory';
  className?: string;
  isHighlighted?: boolean;
  cardId?: string;
  onClose?: () => void;
  onViewDetails?: (vehicleId: string) => void;
}

export default function VehiclePresentationCard({
  vehicle,
  variant = 'directory',
  className = '',
  isHighlighted = false,
  cardId,
  onClose,
  onViewDetails,
}: VehiclePresentationCardProps) {
  const { batteryColor, statusColor, statusLabel, typeLabel, alerts } = getVehicleCardViewModel(vehicle);
  const isMapVariant = variant === 'map';

  if (isMapVariant) {
    return (
      <div
        className={`w-80 overflow-hidden rounded-[24px] border border-[#E6E6E6] bg-white shadow-lg transition-all duration-200 ${className}`.trim()}
      >
        <div className="relative border-b border-[#E6E6E6] px-4 py-3">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              style={{ color: '#616161' }}
              aria-label="Cerrar tarjeta"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <h3 className="pr-6 text-base font-semibold text-[#1E1E1E]">{vehicle.model}</h3>
        </div>

        <div className="flex flex-col gap-2.5 px-4 py-3">
          <InfoRow icon={<UserIcon />} label="Usuario" value={vehicle.driver} />

          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              <BoltIcon />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-[#1E1E1E]">Batería</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full animate-battery-fill"
                    style={{ width: `${vehicle.battery}%`, backgroundColor: batteryColor }}
                  />
                </div>
                <span className="text-sm font-medium tabular-nums text-[#616161]">{vehicle.battery}%</span>
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
              className="w-full cursor-pointer rounded-xl bg-[#2563EB] py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Ver Detalles
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <article
      id={cardId}
      tabIndex={-1}
      className={`group rounded-[28px] border border-[#E6E6E6] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] ${isHighlighted ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-[0_0_0_2px_rgba(37,99,235,0.08)]' : ''} ${className}`.trim()}
    >
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

      <div className="rounded-[20px] border border-[#ECEFF4] bg-[#F8FAFC] p-4">
        <div className="space-y-4 text-sm text-[#616161]">
          <InfoRow label="Usuario" value={vehicle.driver} />
          <InfoRow label="Tipo de unidad" value={typeLabel} />
          <InfoRow label="Autonomía restante" value={`${vehicle.autonomy} km`} />
          <InfoRow label="Última actualización" value={vehicle.lastUpdate} />

          <div className="rounded-[18px] border border-[#E6E6E6] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#616161]">
              <span>Batería</span>
              <span className="font-semibold text-[#1E1E1E]">{vehicle.battery}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#F0F2F5] shadow-inner">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${vehicle.battery}%`, backgroundColor: batteryColor }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-[#E6E6E6] bg-[#FAFBFC] p-4 text-sm text-[#616161]">
        <p className="font-semibold text-[#1E1E1E]">Ubicación</p>
        <p className="mt-1 leading-relaxed">{vehicle.location.address}</p>
      </div>

      <div className="mt-4 rounded-[24px] border border-[#E6E6E6] bg-[#FAFBFC] px-4 py-3 text-sm">
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
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">{icon}</div>
      ) : null}
      <div className="flex-1">
        <span className="text-sm font-medium text-[#1E1E1E]">{label}</span>
        <p className="mt-0.5 text-sm text-[#616161]">{value}</p>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-5 w-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-5 w-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" style={{ color: '#1E1E1E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
