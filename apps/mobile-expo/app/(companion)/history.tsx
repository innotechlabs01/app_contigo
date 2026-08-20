import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { useTheme } from '@/src/hooks/useTheme';
import { RequestCard } from '@/src/components/RequestCard';
import { FilterChips } from '@/src/components/FilterChips';
import { spacing } from '@/src/theme/spacing';
import type { ServiceRequest, RequestStatus } from '@/src/types';

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
  const theme = useTheme();

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestApi.list();
      setRequests(data);
    } catch {
      // TODO: show error toast
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
    <RequestCard
      item={item}
      surfaceColor={theme.surface}
      subtitleColor={theme.onSurfaceVariant}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.onBackground }]}>Historial</Text>

      <FilterChips
        filters={filters}
        active={activeFilter}
        onSelect={(f) => setActiveFilter(f as FilterType)}
        activeColor={theme.primary}
        surfaceVariantColor={theme.surfaceVariant}
        onSurfaceVariantColor={theme.onSurfaceVariant}
        onPrimaryColor={theme.onPrimary}
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
            <Text style={[styles.emptyText, { color: theme.onSurfaceVariant }]}>
              No hay solicitudes en el historial
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', padding: spacing.lg, paddingTop: spacing.xxl },
  list: { padding: spacing.lg },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText: { fontSize: 16 },
});
