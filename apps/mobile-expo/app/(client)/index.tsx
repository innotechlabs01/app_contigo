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
import { useTheme } from '@/src/hooks/useTheme';
import { StatCard } from '@/src/components/StatCard';
import { spacing, radius } from '@/src/theme/spacing';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { requests, setRequests, setLoading, isLoading } = useRequestStore();
  const router = useRouter();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.onBackground }]}>
          Hola, {user?.first_name || 'Usuario'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
          Bienvenido a Contigo
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard value={pendingCount} label="Pendientes" color={theme.primary} />
        <StatCard value={acceptedCount} label="Aceptadas" color={theme.success} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.onBackground }]}>
          Acciones rapidas
        </Text>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}
          onPress={() => router.push('/(client)/requests')}
        >
          <Text style={[styles.actionTitle, { color: theme.onSurface }]}>
            Ver solicitudes
          </Text>
          <Text style={[styles.actionSubtitle, { color: theme.onSurfaceVariant }]}>
            Revisa el estado de tus solicitudes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.lg, paddingTop: spacing.xxl },
  greeting: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: spacing.xs },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.md },
  actionCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  actionTitle: { fontSize: 16, fontWeight: '600' },
  actionSubtitle: { fontSize: 14, marginTop: spacing.xs },
});
