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
  ScrollView,
} from 'react-native';
import { useSignUp } from '@clerk/expo';
import { useRouter } from 'expo-router';

import { useTheme } from '@/src/hooks/useTheme';
import { spacing, radius } from '@/src/theme/spacing';

type Step = 0 | 1 | 2 | 3;

export default function RegisterScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const theme = useTheme();
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);

  // Step 0: Personal data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'companion'>('client');

  // Step 1: Service (client only)
  const [serviceType, setServiceType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Step 2: Companion (client only)
  const [companionId] = useState('');

  const stepLabels = role === 'companion'
    ? ['Tus datos', 'Revisar']
    : ['Tus datos', 'Servicio', 'Compania', 'Revisar'];

  const canNext = (): boolean => {
    if (role === 'companion') {
      switch (step) {
        case 0:
          return !!firstName && !!lastName && !!email && !!password;
        case 1:
          return true;
        default:
          return false;
      }
    }
    switch (step) {
      case 0:
        return !!firstName && !!lastName && !!email && !!password;
      case 1:
        return !!serviceType && !!preferredDate && !!address;
      case 2:
        return !!companionId;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await signUp?.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        phoneNumber: phone || undefined,
      });

      if (result && 'createdSessionId' in result && result.createdSessionId) {
        // upsertMe is handled by _layout.tsx after Clerk auth state propagates.
        // Role is auto-assigned by backend based on email domain.
        router.replace(role === 'companion' ? '/(companion)' : '/(client)');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar';
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
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={[styles.title, { color: theme.onBackground }]}>
          Crear cuenta
        </Text>

        {/* Stepper */}
        <View style={styles.stepper}>
          {stepLabels.map((label, i) => (
            <View key={i} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor:
                      i <= step ? theme.primary : theme.surfaceVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    { color: i <= step ? '#FFF' : theme.onSurfaceVariant },
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color:
                      i <= step ? theme.primary : theme.onSurfaceVariant,
                  },
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Step content */}
        <View style={styles.form}>
          {step === 0 && (
            <>
              <Field label="Nombre" value={firstName} onChange={setFirstName} theme={theme} />
              <Field label="Apellido" value={lastName} onChange={setLastName} theme={theme} />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                keyboard="email-address"
                theme={theme}
              />
              <Field label="Telefono" value={phone} onChange={setPhone} phone theme={theme} />
              <Field
                label="Contrasena"
                value={password}
                onChange={setPassword}
                secure
                theme={theme}
              />

              <Text style={[styles.label, { color: theme.onSurface }]}>
                Tipo de cuenta
              </Text>
              <View style={styles.serviceGrid}>
                {[
                  { value: 'client', label: 'Cliente' },
                  { value: 'companion', label: 'Compania' },
                ].map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[
                      styles.serviceOption,
                      {
                        borderColor:
                          role === r.value ? theme.primary : theme.outlineVariant,
                        backgroundColor:
                          role === r.value
                            ? theme.primary + '10'
                            : theme.surface,
                      },
                    ]}
                    onPress={() => setRole(r.value as 'client' | 'companion')}
                  >
                    <Text
                      style={{
                        color:
                          role === r.value ? theme.primary : theme.onSurface,
                        fontWeight: role === r.value ? '600' : '400',
                      }}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {step === 1 && role === 'client' && (
            <>
              <Text style={[styles.label, { color: theme.onSurface }]}>
                Tipo de servicio
              </Text>
              <View style={styles.serviceGrid}>
                {['Acomp. Medico', 'Compania Diaria', 'Tramites'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.serviceOption,
                      {
                        borderColor:
                          serviceType === s ? theme.primary : theme.outlineVariant,
                        backgroundColor:
                          serviceType === s
                            ? theme.primary + '10'
                            : theme.surface,
                      },
                    ]}
                    onPress={() => setServiceType(s)}
                  >
                    <Text
                      style={{
                        color:
                          serviceType === s ? theme.primary : theme.onSurface,
                        fontWeight: serviceType === s ? '600' : '400',
                      }}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Field
                label="Fecha preferida"
                value={preferredDate}
                onChange={setPreferredDate}
                placeholder="DD/MM/AAAA"
                theme={theme}
              />
              <Field label="Direccion" value={address} onChange={setAddress} theme={theme} />
              <Field label="Notas" value={notes} onChange={setNotes} multiline theme={theme} />
            </>
          )}

          {step === 2 && role === 'client' && (
            <View style={styles.emptyCompanion}>
              <Text style={[styles.emptyText, { color: theme.onSurfaceVariant }]}>
                Seleccion de compania (proximamente)
              </Text>
            </View>
          )}

          {step === 3 && (
            <View style={styles.review}>
              <ReviewRow label="Nombre" value={`${firstName} ${lastName}`} theme={theme} />
              <ReviewRow label="Email" value={email} theme={theme} />
              <ReviewRow label="Rol" value={role === 'companion' ? 'Compania' : 'Cliente'} theme={theme} />
              {role === 'client' && (
                <>
                  <ReviewRow label="Servicio" value={serviceType} theme={theme} />
                  <ReviewRow label="Fecha" value={preferredDate} theme={theme} />
                  <ReviewRow label="Direccion" value={address} theme={theme} />
                </>
              )}
            </View>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.nav}>
          {step > 0 && (
            <TouchableOpacity
              style={[styles.backButton, { borderColor: theme.outline }]}
              onPress={() => {
                if (role === 'companion' && step === 3) {
                  setStep(0);
                } else {
                  setStep((step - 1) as Step);
                }
              }}
            >
              <Text style={[styles.backText, { color: theme.primary }]}>Atras</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: canNext() ? theme.primary : theme.outline,
                opacity: loading ? 0.6 : 1,
              },
            ]}
            onPress={() => {
              if (step < 3) {
                if (role === 'companion' && step === 0) {
                  setStep(3);
                } else {
                  setStep((step + 1) as Step);
                }
              } else {
                handleRegister();
              }
            }}
            disabled={!canNext() || loading}
          >
            <Text style={styles.nextText}>
              {step === 3 ? (loading ? 'Creando...' : 'Crear cuenta') : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Ya tengo cuenta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboard,
  secure,
  phone,
  multiline,
  theme,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboard?: 'email-address' | 'phone-pad' | 'default';
  secure?: boolean;
  phone?: boolean;
  multiline?: boolean;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[fieldStyles.label, { color: theme.onSurface }]}>{label}</Text>
      <TextInput
        style={[
          fieldStyles.input,
          {
            backgroundColor: theme.surfaceVariant,
            borderColor: theme.outlineVariant,
            color: theme.onSurface,
          },
          multiline && { height: 80 },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        placeholderTextColor={theme.onSurfaceVariant}
        keyboardType={keyboard || 'default'}
        secureTextEntry={secure}
        multiline={multiline}
        autoCapitalize={secure || keyboard === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );
}

function ReviewRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[reviewStyles.row, { borderBottomColor: theme.outlineVariant }]}>
      <Text style={[reviewStyles.label, { color: theme.onSurfaceVariant }]}>
        {label}
      </Text>
      <Text style={[reviewStyles.value, { color: theme.onSurface }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: spacing.lg, paddingTop: spacing.xxl },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.lg },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: { fontSize: 14, fontWeight: '600' },
  stepLabel: { fontSize: 10, marginTop: spacing.xs, textAlign: 'center' },
  form: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '500', marginBottom: spacing.xs },
  serviceGrid: { gap: spacing.sm, marginBottom: spacing.md },
  serviceOption: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  emptyCompanion: { alignItems: 'center', padding: spacing.xxl },
  emptyText: { fontSize: 16 },
  review: { gap: spacing.sm },
  nav: { flexDirection: 'row', gap: spacing.md },
  backButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  backText: { fontSize: 16, fontWeight: '600' },
  nextButton: {
    flex: 2,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  nextText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', marginTop: spacing.lg },
  linkText: { fontSize: 14, fontWeight: '500' },
});

const fieldStyles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '500', marginBottom: spacing.xs },
  input: {
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
});

const reviewStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '500' },
});
