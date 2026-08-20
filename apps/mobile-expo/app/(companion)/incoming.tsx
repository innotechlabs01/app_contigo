import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { wsService } from '@/src/api/websocket';
import { useTheme } from '@/src/hooks/useTheme';
import { RequestCard } from '@/src/components/RequestCard';
import { spacing, radius } from '@/src/theme/spacing';
import type { ServiceRequest } from '@/src/types';

export default function IncomingRequestsScreen() {
  const { requests, setRequests, updateRequest, removeRequest, setLoading, isLoading } =
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
  }, []);

  const incomingRequests = requests.filter((r) => r.status === 'pending');

  const handleAccept = async (id: string) => {
    try {
      await requestApi.accept(id);
      removeRequest(id);
      Alert.alert('Solicitud aceptada', 'La solicitud fue aceptada exitosamente.');
    } catch {
      Alert.alert('Error', 'No se pudo aceptar la solicitud.');
    }
  };

  const handleReject = async (id: string) => {
    Alert.alert(
      'Rechazar solicitud',
      'Estas seguro de que quieres rechazar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              await requestApi.reject(id);
              removeRequest(id);
              Alert.alert('Solicitud rechazada');
            } catch {
              Alert.alert('Error', 'No se pudo rechazar la solicitud.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ServiceRequest }) => (
    <View>
      <RequestCard
        item={item}
        surfaceColor={theme.surface}
        subtitleColor={theme.onSurfaceVariant}
        showDetails
      />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.acceptButton, { backgroundColor: theme.success }]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectButton, { backgroundColor: theme.error }]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.rejectText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.onBackground }]}>
        Solicitudes entrantes
      </Text>
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.onSurfaceVariant }]}>
              No hay solicitudes pendientes
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
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  acceptButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  acceptText: { color: '#FFFFFF', fontWeight: '600' },
  rejectButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rejectText: { color: '#FFFFFF', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText: { fontSize: 16 },
});
