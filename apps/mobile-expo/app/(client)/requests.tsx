import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { wsService } from '@/src/api/websocket';
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

export default function RequestsScreen() {
  const { requests, setRequests, updateRequest, setLoading, isLoading } =
    useRequestStore();

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

    const unsubscribe = wsService.subscribe((event) => {
      if (event.data) {
        updateRequest(event.data);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Text style={styles.title}>Mis solicitudes</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay solicitudes aun</Text>
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
