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

import { useTheme } from '@/src/hooks/useTheme';
import { spacing, radius } from '@/src/theme/spacing';

export default function LoginScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const theme = useTheme();
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
        // Role-based redirect is handled by _layout.tsx after Clerk auth state propagates
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
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.onBackground }]}>
          Iniciar sesion
        </Text>
        <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
          Bienvenido a Contigo
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.onSurface }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surfaceVariant, borderColor: theme.outlineVariant, color: theme.onSurface }]}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor={theme.onSurfaceVariant}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={[styles.label, { color: theme.onSurface }]}>Contrasena</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surfaceVariant, borderColor: theme.outlineVariant, color: theme.onSurface }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contrasena"
            placeholderTextColor={theme.onSurfaceVariant}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.6 : 1 }]}
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
            <Text style={[styles.linkText, { color: theme.primary }]}>
              Crear cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: 32, fontWeight: '700', marginBottom: spacing.xs },
  subtitle: { fontSize: 16, marginBottom: spacing.xxl },
  form: { gap: spacing.md },
  label: { fontSize: 14, fontWeight: '500', marginBottom: spacing.xs },
  input: {
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', marginTop: spacing.md },
  linkText: { fontSize: 14, fontWeight: '500' },
});
