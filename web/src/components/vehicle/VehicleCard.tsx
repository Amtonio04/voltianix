import type { Vehicle } from '../../types/vehicle';
import VehiclePresentationCard from './VehiclePresentationCard';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClose: () => void;
  onViewDetails: (vehicleId: string) => void;
}

export default function VehicleCard({ vehicle, onClose, onViewDetails }: VehicleCardProps) {
  return (
    <VehiclePresentationCard
      vehicle={vehicle}
      variant="map"
      onClose={onClose}
      onViewDetails={onViewDetails}
    />
  );
}
