import type { RequestStatus } from '@/src/types';

export const statusColors: Record<RequestStatus, string> = {
  pending: '#ED6C02',
  accepted: '#2E7D32',
  rejected: '#BA1A1A',
  cancelled: '#9E9E9E',
  expired: '#9E9E9E',
  completed: '#2E7D32',
};

export const statusLabels: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  expired: 'Expirada',
  completed: 'Completada',
};
