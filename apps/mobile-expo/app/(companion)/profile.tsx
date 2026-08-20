import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/src/stores/auth-store';
import { useTheme } from '@/src/hooks/useTheme';
import { spacing, radius } from '@/src/theme/spacing';

export default function CompanionProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useAuthStore();
  const router = useRouter();
  const theme = useTheme();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.onBackground }]}>Perfil</Text>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Nombre</Text>
        <Text style={[styles.value, { color: theme.onSurface }]}>
          {user?.first_name} {user?.last_name}
        </Text>

        <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Email</Text>
        <Text style={[styles.value, { color: theme.onSurface }]}>{user?.email}</Text>

        <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Rol</Text>
        <Text style={[styles.value, { color: theme.onSurface }]}>Compania</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>
          Informacion de compania
        </Text>
        <Text style={[styles.placeholder, { color: theme.onSurfaceVariant }]}>
          Informacion de perfil de compania proximamente.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={[styles.signOutText, { color: theme.error }]}>
            Cerrar sesion
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', padding: spacing.lg, paddingTop: spacing.xxl },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  label: { fontSize: 12, marginBottom: spacing.xs, marginTop: spacing.sm },
  value: { fontSize: 16, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  placeholder: { fontSize: 14 },
  signOutButton: { padding: spacing.sm, alignItems: 'center' },
  signOutText: { fontSize: 16, fontWeight: '600' },
});
