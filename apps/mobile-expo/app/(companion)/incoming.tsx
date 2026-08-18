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
import { colors } from '@/src/theme/colors';
import { spacing, radius, shadow } from '@/src/theme/spacing';
import type { ServiceRequest } from '@/src/types';

export default function IncomingRequestsScreen() {
  const { requests, setRequests, updateRequest, removeRequest, setLoading, isLoading } =
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
    <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service_type}</Text>
        <View style={[styles.pendingBadge]}>
          <Text style={styles.pendingText}>Pendiente</Text>
        </View>
      </View>

      <Text style={styles.cardSubtitle}>{item.full_name}</Text>
      <Text style={styles.cardDetail}>Fecha: {item.preferred_date}</Text>
      <Text style={styles.cardDetail}>Direccion: {item.address}</Text>
      {item.notes ? (
        <Text style={styles.cardNotes}>Notas: {item.notes}</Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.acceptButton]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectButton]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.rejectText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.light.background }]}>
      <Text style={styles.title}>Solicitudes entrantes</Text>
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
            <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
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
  pendingBadge: {
    backgroundColor: colors.light.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  pendingText: { fontSize: 12, fontWeight: '600', color: colors.light.warning },
  cardSubtitle: {
    fontSize: 14,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardDetail: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardNotes: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.light.success,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  acceptText: { color: '#FFFFFF', fontWeight: '600' },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.light.error,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rejectText: { color: '#FFFFFF', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText: { fontSize: 16, color: colors.light.onSurfaceVariant },
});
