# Companion UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add companion role UI to the Contigo mobile-expo app with role-based tab navigation.

**Architecture:** Two route groups — `(client)` for existing client tabs and `(companion)` for new companion tabs. Root layout detects user role and redirects to the correct group. Companion gets 4 tabs: Dashboard, Incoming Requests, History, Profile.

**Tech Stack:** Expo SDK 57, React 19, TypeScript, Expo Router, Clerk, Zustand, React Native

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Create | `app/(companion)/_layout.tsx` | Companion tab layout (4 tabs) |
| Create | `app/(companion)/index.tsx` | Companion dashboard with stats |
| Create | `app/(companion)/incoming.tsx` | Incoming requests with accept/reject |
| Create | `app/(companion)/history.tsx` | Request history with filter chips |
| Create | `app/(companion)/profile.tsx` | Profile + logout |
| Move | `app/(tabs)/_layout.tsx` → `app/(client)/_layout.tsx` | Rename route group |
| Move | `app/(tabs)/index.tsx` → `app/(client)/index.tsx` | Move client home |
| Move | `app/(tabs)/requests.tsx` → `app/(client)/requests.tsx` | Move client requests |
| Move | `app/(tabs)/profile.tsx` → `app/(client)/profile.tsx` | Move client profile |
| Modify | `app/_layout.tsx` | Add role-based redirect |
| Modify | `app/(auth)/login.tsx` | Redirect based on role after login |
| Modify | `app/(auth)/register.tsx` | Hide for companion role (optional) |

---

## Task 1: Rename (tabs) to (client)

**Files:**
- Rename: `app/(tabs)/` → `app/(client)/`

- [ ] **Step 1: Rename the directory**

```bash
cd apps/mobile-expo
mv "app/(tabs)" "app/(client)"
```

- [ ] **Step 2: Update internal imports if any**

No imports reference `(tabs)` directly — Expo Router uses file-based routing. Verify no hardcoded `(tabs)` strings exist.

- [ ] **Step 3: Update unstable_settings in _layout.tsx**

In `app/_layout.tsx`, change:
```typescript
export const unstable_settings = {
  initialRouteName: '(client)',
};
```

- [ ] **Step 4: Update Stack.Screen name**

In `app/_layout.tsx`, change:
```tsx
<Stack.Screen name="(client)" options={{ headerShown: false }} />
```

- [ ] **Step 5: Update profile.tsx redirect**

In `app/(client)/profile.tsx`, change:
```typescript
router.replace('/(auth)/login');
```
This path is already correct — no change needed.

- [ ] **Step 6: Commit**

```bash
git add app/
git commit -m "refactor: rename (tabs) route group to (client)"
```

---

## Task 2: Update Root Layout for Role Detection

**Files:**
- Modify: `app/_layout.tsx:23-77`

- [ ] **Step 1: Add role-based redirect logic**

Replace the `useEffect` for routing in `RootLayoutNav`:

```typescript
useEffect(() => {
  if (!isLoaded) return;

  const inAuthGroup = segments[0] === '(auth)';

  if (isSignedIn && inAuthGroup) {
    const { user } = useAuthStore.getState();
    const role = user?.role || 'client';
    if (role === 'companion') {
      router.replace('/(companion)');
    } else {
      router.replace('/(client)');
    }
  } else if (!isSignedIn && !inAuthGroup) {
    router.replace('/(auth)/login');
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isSignedIn, segments]);
```

- [ ] **Step 2: Add companion route to Stack**

In the return statement of `RootLayoutNav`:

```tsx
<Stack>
  <Stack.Screen name="(client)" options={{ headerShown: false }} />
  <Stack.Screen name="(companion)" options={{ headerShown: false }} />
  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
</Stack>
```

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: add role-based redirect in root layout"
```

---

## Task 3: Update Login Screen for Role Redirect

**Files:**
- Modify: `app/(auth)/login.tsx`

- [ ] **Step 1: Read current login.tsx**

```typescript
// Current redirect after login:
router.replace('/(tabs)');
```

- [ ] **Step 2: Replace redirect with role-based logic**

After successful login, add role check:

```typescript
import { useAuthStore } from '@/src/stores/auth-store';

// After successful sign-in, in the success callback:
const { user } = useAuthStore.getState();
const role = user?.role || 'client';
if (role === 'companion') {
  router.replace('/(companion)');
} else {
  router.replace('/(client)');
}
```

Note: The `upsertMe` call happens in `RootLayoutNav` init, so by the time login completes, the user with role is already in the store.

- [ ] **Step 3: Commit**

```bash
git add app/(auth)/login.tsx
git commit -m "feat: redirect to role-specific route after login"
```

---

## Task 4: Create Companion Tab Layout

**Files:**
- Create: `app/(companion)/_layout.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from 'react-native';

import { colors } from '@/src/theme/colors';

export default function CompanionTabLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.onSurfaceVariant,
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.onSurface,
        tabBarStyle: { backgroundColor: theme.surface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <SymbolView name="house.fill" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="incoming"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="list.bullet.rectangle"
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => (
            <SymbolView name="clock.fill" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.fill" tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(companion)/_layout.tsx
git commit -m "feat: add companion tab layout with 4 tabs"
```

---

## Task 5: Create Companion Dashboard

**Files:**
- Create: `app/(companion)/index.tsx`

- [ ] **Step 1: Create the dashboard screen**

```tsx
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Text style={styles.subtitle}>Panel decompania</Text>
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
```

- [ ] **Step 2: Commit**

```bash
git add app/(companion)/index.tsx
git commit -m "feat: add companion dashboard with stats"
```

---

## Task 6: Create Incoming Requests Screen

**Files:**
- Create: `app/(companion)/incoming.tsx`

- [ ] **Step 1: Create the incoming requests screen**

```tsx
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { wsService } from '@/src/api/websocket';
import { colors } from '@/src/theme/colors';
import { spacing, radius, shadow } from '@/src/theme/spacing';
import type { ServiceRequest } from '@/src/types';

export default function IncomingRequestsScreen() {
  const { requests, setRequests, updateRequest, removeRequest, setLoading, isLoading } =
    useRequestStore();

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

    const unsubscribe = wsService.subscribe((event) => {
      if (event.data) {
        updateRequest(event.data);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const incomingRequests = requests.filter((r) => r.status === 'pending');

  const handleAccept = async (id: string) => {
    try {
      await requestApi.accept(id);
      removeRequest(id);
      Alert.alert('Solicitud aceptada', 'La solicitud fue aceptada exitosamente.');
    } catch {
      Alert.alert('Error', 'No se pudo aceptar la solicitud.');
    }
  };

  const handleReject = async (id: string) => {
    Alert.alert(
      'Rechazar solicitud',
      'Estas seguro de que quieres rechazar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              await requestApi.reject(id);
              removeRequest(id);
              Alert.alert('Solicitud rechazada');
            } catch {
              Alert.alert('Error', 'No se pudo rechazar la solicitud.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ServiceRequest }) => (
    <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service_type}</Text>
        <View style={[styles.pendingBadge]}>
          <Text style={styles.pendingText}>Pendiente</Text>
        </View>
      </View>

      <Text style={styles.cardSubtitle}>{item.full_name}</Text>
      <Text style={styles.cardDetail}>Fecha: {item.preferred_date}</Text>
      <Text style={styles.cardDetail}>Direccion: {item.address}</Text>
      {item.notes ? (
        <Text style={styles.cardNotes}>Notas: {item.notes}</Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.acceptButton]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectButton]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.rejectText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.light.background }]}>
      <Text style={styles.title}>Solicitudes entrantes</Text>
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
          </View>
        }
      />
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
  list: { padding: spacing.lg },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  pendingBadge: {
    backgroundColor: colors.light.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  pendingText: { fontSize: 12, fontWeight: '600', color: colors.light.warning },
  cardSubtitle: {
    fontSize: 14,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardDetail: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardNotes: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.light.success,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  acceptText: { color: '#FFFFFF', fontWeight: '600' },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.light.error,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rejectText: { color: '#FFFFFF', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText: { fontSize: 16, color: colors.light.onSurfaceVariant },
});
```

- [ ] **Step 2: Add removeRequest to request-store**

The store needs a `removeRequest` action. Add to `src/stores/request-store.ts`:

```typescript
interface RequestState {
  requests: ServiceRequest[];
  isLoading: boolean;
  setRequests: (requests: ServiceRequest[]) => void;
  addRequest: (request: ServiceRequest) => void;
  updateRequest: (request: ServiceRequest) => void;
  removeRequest: (id: string) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

// In the create callback:
removeRequest: (id) =>
  set((state) => ({
    requests: state.requests.filter((r) => r.id !== id),
  })),
```

- [ ] **Step 3: Commit**

```bash
git add app/(companion)/incoming.tsx src/stores/request-store.ts
git commit -m "feat: add incoming requests screen with accept/reject"
```

---

## Task 7: Create History Screen

**Files:**
- Create: `app/(companion)/history.tsx`

- [ ] **Step 1: Create the history screen**

```tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import { useRequestStore } from '@/src/stores/request-store';
import { requestApi } from '@/src/api/endpoints';
import { colors } from '@/src/theme/colors';
import { spacing, radius, shadow } from '@/src/theme/spacing';
import type { ServiceRequest, RequestStatus } from '@/src/types';

const statusColors: Record<RequestStatus, string> = {
  pending: '#ED6C02',
  accepted: '#2E7D32',
  rejected: '#BA1A1A',
  cancelled: '#9E9E9E',
  expired: '#9E9E9E',
  completed: '#2E7D32',
};

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  expired: 'Expirada',
  completed: 'Completada',
};

const filters = ['Todos', 'Aceptadas', 'Completadas', 'Rechazadas'] as const;
type FilterType = (typeof filters)[number];

const filterStatusMap: Record<FilterType, RequestStatus[]> = {
  Todos: ['accepted', 'completed', 'rejected', 'cancelled', 'expired'],
  Aceptadas: ['accepted'],
  Completadas: ['completed'],
  Rechazadas: ['rejected'],
};

export default function HistoryScreen() {
  const { requests, setRequests, setLoading, isLoading } = useRequestStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRequests = requests.filter((r) =>
    filterStatusMap[activeFilter].includes(r.status)
  );

  const renderItem = ({ item }: { item: ServiceRequest }) => (
    <View style={[styles.card, { backgroundColor: colors.light.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service_type}</Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusColors[item.status] + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColors[item.status] },
            ]}
          >
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.full_name}</Text>
      <Text style={styles.cardDate}>{item.preferred_date}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.light.background }]}>
      <Text style={styles.title}>Historial</Text>

      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === item && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterList}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadRequests} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay solicitudes en el historial</Text>
          </View>
        }
      />
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
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.light.surfaceVariant,
  },
  filterChipActive: {
    backgroundColor: colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.onSurfaceVariant,
  },
  filterTextActive: {
    color: colors.light.onPrimary,
  },
  list: { padding: spacing.lg },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardSubtitle: {
    fontSize: 14,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardDate: {
    fontSize: 12,
    color: colors.light.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText: { fontSize: 16, color: colors.light.onSurfaceVariant },
});
```

- [ ] **Step 2: Commit**

```bash
git add app/(companion)/history.tsx
git commit -m "feat: add companion history screen with filter chips"
```

---

## Task 8: Create Companion Profile Screen

**Files:**
- Create: `app/(companion)/profile.tsx`

- [ ] **Step 1: Create the profile screen**

```tsx
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
        <Text style={styles.sectionTitle}>Informacion decompania</Text>
        <Text style={styles.placeholder}>
          Informacion de perfil decompania proximamente.
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
```

- [ ] **Step 2: Commit**

```bash
git add app/(companion)/profile.tsx
git commit -m "feat: add companion profile screen"
```

---

## Task 9: Verify Both Flows Work

**Files:**
- None (verification only)

- [ ] **Step 1: Run TypeScript check**

```bash
cd apps/mobile-expo
npx tsc --noEmit
```

- [ ] **Step 2: Run linter**

```bash
npx expo lint
```

- [ ] **Step 3: Test client flow**

1. Login with client account
2. Verify redirect to `/(client)` tabs
3. Check Inicio, Mis Solicitudes, Perfil work
4. Verify logout redirects to login

- [ ] **Step 4: Test companion flow**

1. Login with companion account (registered via web)
2. Verify redirect to `/(companion)` tabs
3. Check Inicio shows stats
4. Check Solicitudes shows pending requests
5. Accept a request → verify it disappears from list
6. Reject a request → verify confirmation dialog
7. Check Historial shows past requests
8. Check filter chips work
9. Verify logout redirects to login

- [ ] **Step 5: Rebuild Docker mobile container**

```bash
cd apps/mobile-expo
docker compose up -d --build
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: companion UI complete with role-based navigation"
```
