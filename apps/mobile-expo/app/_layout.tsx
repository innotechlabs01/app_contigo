import { useEffect } from 'react';
import { useFonts, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from '@expo-google-fonts/lexend';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, useAuth } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';

import { useAuthStore } from '@/src/stores/auth-store';
import { setAuthToken } from '@/src/api/client';
import { wsService } from '@/src/api/websocket';
import { userApi } from '@/src/api/endpoints';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(client)',
};

SplashScreen.preventAutoHideAsync();

const clerkPubKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { setUser, setLoaded } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    const init = async () => {
      if (isSignedIn) {
        try {
          const token = await SecureStore.getItemAsync('clerk_jwt');
          if (token) {
            setAuthToken(token);
            const user = await userApi.upsertMe({
              email: '',
              first_name: '',
              last_name: '',
            });
            setUser(user);
            wsService.connect();
          }
        } catch {
          // token may be stale
        }
      }

      setLoaded(true);
      SplashScreen.hideAsync();
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(client)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, segments]);

  return (
    <Stack>
      <Stack.Screen name="(client)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}
