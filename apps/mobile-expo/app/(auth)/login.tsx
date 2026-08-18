import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';

import { colors } from '@/src/theme/colors';
import { spacing, radius } from '@/src/theme/spacing';
import { useAuthStore } from '@/src/stores/auth-store';

export default function LoginScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingresa email y contrasena');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn?.create({ identifier: email, password });
      if (result && 'createdSessionId' in result && result.createdSessionId) {
        const role = useAuthStore.getState().user?.role;
        if (role === 'companion') {
          router.replace('/(companion)');
        } else {
          router.replace('/(client)');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Credenciales invalidas';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Iniciar sesion</Text>
        <Text style={styles.subtitle}>Bienvenido a Contigo</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.label}>Contrasena</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contrasena"
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={[styles.linkText, { color: colors.light.primary }]}>
              Crear cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.light.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.onSurfaceVariant,
    marginBottom: spacing.xxl,
  },
  form: { gap: spacing.md },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.onSurface,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.light.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.light.outlineVariant,
  },
  button: {
    backgroundColor: colors.light.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', marginTop: spacing.md },
  linkText: { fontSize: 14, fontWeight: '500' },
});
