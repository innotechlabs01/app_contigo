import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { colors } from '@/src/theme/colors';
import { spacing, radius, shadow } from '@/src/theme/spacing';
import type { ServiceRequest, RequestStatus } from '@/src/types';

const statusColors: Record<RequestStatus, string> = {
  pending: '#ED6C02',
  accepted: '#2E7D32',
  rejected: '#BA1A1A',
  cancelled: '#9E9E9E',
  expired: '#9E9E9E',
  completed: '#2E7D32',
};

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  expired: 'Expirada',
  completed: 'Completada',
};

const filters = ['Todos', 'Aceptadas', 'Completadas', 'Rechazadas'] as const;
type FilterType = (typeof filters)[number];

const filterStatusMap: Record<FilterType, RequestStatus[]> = {
  Todos: ['accepted', 'completed', 'rejected', 'cancelled', 'expired'],
  Aceptadas: ['accepted'],
  Completadas: ['completed'],
  Rechazadas: ['rejected'],
};

export default function HistoryScreen() {
  const { requests, setRequests, setLoading, isLoading } = useRequestStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestApi.list();
      setRequests(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) =>
    filterStatusMap[activeFilter].includes(r.status)
  );

  const renderItem = ({ item }: { item: ServiceRequest }) => (
    <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service_type}</Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusColors[item.status] + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColors[item.status] },
            ]}
          >
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.full_name}</Text>
      <Text style={styles.cardDate}>{item.preferred_date}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.light.background }]}>
      <Text style={styles.title}>Historial</Text>

      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === item && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterList}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay solicitudes en el historial</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.light.surfaceVariant,
  },
  filterChipActive: {
    backgroundColor: colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.onSurfaceVariant,
  },
  filterTextActive: {
    color: colors.light.onPrimary,
  },
  list: { padding: spacing.lg },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardSubtitle: {
    fontSize: 14,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardDate: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText: { fontSize: 16, color: colors.light.onSurfaceVariant },
});
