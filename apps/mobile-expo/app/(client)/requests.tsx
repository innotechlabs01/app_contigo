import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { wsService } from '@/src/api/websocket';
import { useTheme } from '@/src/hooks/useTheme';
import { RequestCard } from '@/src/components/RequestCard';
import { spacing } from '@/src/theme/spacing';
import type { ServiceRequest } from '@/src/types';

export default function RequestsScreen() {
  const { requests, setRequests, updateRequest, setLoading, isLoading } =
    useRequestStore();
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

    const unsubscribe = wsService.subscribe((event) => {
      if (event.data) {
        updateRequest(event.data);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: ServiceRequest }) => (
    <RequestCard
      item={item}
      surfaceColor={theme.surface}
      subtitleColor={theme.onSurfaceVariant}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.onBackground }]}>
        Mis solicitudes
      </Text>
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
            <Text style={[styles.emptyText, { color: theme.onSurfaceVariant }]}>
              No hay solicitudes aun
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
