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

import { colors } from '@/src/theme/colors';
import { spacing, radius } from '@/src/theme/spacing';
import { userApi } from '@/src/api/endpoints';
import { setAuthToken } from '@/src/api/client';
import * as SecureStore from 'expo-secure-store';

type Step = 0 | 1 | 2 | 3;

export default function RegisterScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();
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
        const token = await SecureStore.getItemAsync('clerk_jwt');
        if (token) {
          setAuthToken(token);
          await userApi.upsertMe({
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
            role,
          });
        }

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Crear cuenta</Text>

        {/* Stepper */}
        <View style={styles.stepper}>
          {stepLabels.map((label, i) => (
            <View key={i} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor:
                      i <= step ? colors.light.primary : colors.light.outlineVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    { color: i <= step ? '#FFF' : colors.light.onSurfaceVariant },
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
                      i <= step ? colors.light.primary : colors.light.onSurfaceVariant,
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
              <Field label="Nombre" value={firstName} onChange={setFirstName} />
              <Field label="Apellido" value={lastName} onChange={setLastName} />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                keyboard="email-address"
              />
              <Field label="Telefono" value={phone} onChange={setPhone} phone />
              <Field
                label="Contrasena"
                value={password}
                onChange={setPassword}
                secure
              />

              <Text style={styles.label}>Tipo de cuenta</Text>
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
                          role === r.value
                            ? colors.light.primary
                            : colors.light.outlineVariant,
                        backgroundColor:
                          role === r.value
                            ? colors.light.primary + '10'
                            : colors.light.surface,
                      },
                    ]}
                    onPress={() => setRole(r.value as 'client' | 'companion')}
                  >
                    <Text
                      style={{
                        color:
                          role === r.value
                            ? colors.light.primary
                            : colors.light.onSurface,
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
              <Text style={styles.label}>Tipo de servicio</Text>
              <View style={styles.serviceGrid}>
                {['Acomp. Medico', 'Compania Diaria', 'Tramites'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.serviceOption,
                      {
                        borderColor:
                          serviceType === s
                            ? colors.light.primary
                            : colors.light.outlineVariant,
                        backgroundColor:
                          serviceType === s
                            ? colors.light.primary + '10'
                            : colors.light.surface,
                      },
                    ]}
                    onPress={() => setServiceType(s)}
                  >
                    <Text
                      style={{
                        color:
                          serviceType === s
                            ? colors.light.primary
                            : colors.light.onSurface,
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
              />
              <Field
                label="Direccion"
                value={address}
                onChange={setAddress}
              />
              <Field
                label="Notas"
                value={notes}
                onChange={setNotes}
                multiline
              />
            </>
          )}

          {step === 2 && role === 'client' && (
            <View style={styles.emptyCompanion}>
              <Text style={styles.emptyText}>
                Seleccion de compania (proximamente)
              </Text>
            </View>
          )}

          {step === 3 && (
            <View style={styles.review}>
              <ReviewRow label="Nombre" value={`${firstName} ${lastName}`} />
              <ReviewRow label="Email" value={email} />
              <ReviewRow label="Rol" value={role === 'companion' ? 'Compania' : 'Cliente'} />
              {role === 'client' && (
                <>
                  <ReviewRow label="Servicio" value={serviceType} />
                  <ReviewRow label="Fecha" value={preferredDate} />
                  <ReviewRow label="Direccion" value={address} />
                </>
              )}
            </View>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.nav}>
          {step > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (role === 'companion' && step === 3) {
                  setStep(0);
                } else {
                  setStep((step - 1) as Step);
                }
              }}
            >
              <Text style={[styles.backText, { color: colors.light.primary }]}>
                Atras
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: canNext()
                  ? colors.light.primary
                  : colors.light.outline,
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
          <Text style={[styles.linkText, { color: colors.light.primary }]}>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboard?: 'email-address' | 'phone-pad' | 'default';
  secure?: boolean;
  phone?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline && { height: 80 }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        keyboardType={keyboard || 'default'}
        secureTextEntry={secure}
        multiline={multiline}
        autoCapitalize={secure || keyboard === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={reviewStyles.row}>
      <Text style={reviewStyles.label}>{label}</Text>
      <Text style={reviewStyles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  inner: { padding: spacing.lg, paddingTop: spacing.xxl },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.onBackground,
    marginBottom: spacing.lg,
  },
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.onSurface,
    marginBottom: spacing.xs,
  },
  serviceGrid: { gap: spacing.sm, marginBottom: spacing.md },
  serviceOption: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  emptyCompanion: { alignItems: 'center', padding: spacing.xxl },
  emptyText: { fontSize: 16, color: colors.light.onSurfaceVariant },
  review: { gap: spacing.sm },
  nav: { flexDirection: 'row', gap: spacing.md },
  backButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.light.outline,
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
});

const reviewStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.outlineVariant,
  },
  label: { fontSize: 14, color: colors.light.onSurfaceVariant },
  value: { fontSize: 14, fontWeight: '500' },
});
