import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/src/stores/auth-store';
import { colors } from '@/src/theme/colors';
import { spacing, radius } from '@/src/theme/spacing';

export default function CompanionProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.light.background }]}>
      <Text style={styles.title}>Perfil</Text>

      <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>
          {user?.first_name} {user?.last_name}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>Compania</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
        <Text style={styles.sectionTitle}>Informacion de compania</Text>
        <Text style={styles.placeholder}>
          Informacion de perfil de compania proximamente.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={[styles.signOutText, { color: colors.light.error }]}>
            Cerrar sesion
          </Text>
        </TouchableOpacity>
      </View>
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
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  label: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  value: { fontSize: 16, fontWeight: '500' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  placeholder: {
    fontSize: 14,
    color: colors.light.onSurfaceVariant,
  },
  signOutButton: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
