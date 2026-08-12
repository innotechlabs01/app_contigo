import { Stack } from 'expo-router';

import { colors } from '@/src/theme/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.light.background },
        headerTintColor: colors.light.onBackground,
        contentStyle: { backgroundColor: colors.light.background },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
