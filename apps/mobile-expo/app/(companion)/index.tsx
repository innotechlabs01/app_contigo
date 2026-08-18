import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/src/stores/auth-store';
import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { colors } from '@/src/theme/colors';
import { spacing, radius } from '@/src/theme/spacing';

export default function CompanionDashboard() {
  const { user } = useAuthStore();
  const { requests, setRequests, setLoading, isLoading } = useRequestStore();
  const router = useRouter();

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

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.light.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hola, {user?.first_name || 'Compania'}
        </Text>
        <Text style={styles.subtitle}>Panel de compania</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.light.warning }]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.light.success }]}>
          <Text style={styles.statNumber}>{acceptedCount}</Text>
          <Text style={styles.statLabel}>Aceptadas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.light.primary }]}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rapidas</Text>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.light.surface }]}
          onPress={() => router.push('/(companion)/incoming')}
        >
          <Text style={styles.actionTitle}>Ver solicitudes entrantes</Text>
          <Text style={styles.actionSubtitle}>
            Revisa y responde a las solicitudes de clientes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.lg, paddingTop: spacing.xxl },
  greeting: { fontSize: 28, fontWeight: '700', color: colors.light.onBackground },
  subtitle: {
    fontSize: 16,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: '#FFFFFF', marginTop: spacing.xs },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.md },
  actionCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.light.outlineVariant,
  },
  actionTitle: { fontSize: 16, fontWeight: '600' },
  actionSubtitle: {
    fontSize: 14,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
});
