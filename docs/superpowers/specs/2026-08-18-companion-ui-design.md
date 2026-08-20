# Companion UI - Mobile Expo Design Spec

## Overview

Add companion role UI to the Contigo mobile-expo app. Companions are registered via the web app and only need login + companion-specific screens on mobile. The app detects the user's role and shows the appropriate tab set.

## Architecture

### Navigation Structure

```
app/
├── _layout.tsx                    # Root layout (ClerkProvider + auth guard + role redirect)
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx              # Client only (hidden for companions)
├── (client)/                     # Client role routes
│   ├── _layout.tsx               # Tabs: Inicio, Mis Solicitudes, Perfil
│   ├── index.tsx
│   ├── requests.tsx
│   └── profile.tsx
└── (companion)/                  # Companion role routes
    ├── _layout.tsx               # Tabs: Inicio, Solicitudes, Historial, Perfil
    ├── index.tsx                 # Dashboard with stats
    ├── incoming.tsx              # Incoming requests (accept/reject)
    ├── history.tsx               # Past requests
    └── profile.tsx               # Profile + logout
```

### Role Detection Flow

1. Login → backend returns user with `role` field
2. `authStore.setUser(user)` stores the role
3. `RootLayoutNav` checks `user.role`:
   - `'client'` → redirect to `/(client)`
   - `'companion'` → redirect to `/(companion)`
   - `'admin'` → redirect to `/(client)` (future: admin panel)

### Files to Modify

- `app/_layout.tsx` — Add role-based redirect logic
- `app/(auth)/login.tsx` — Add role-based redirect after login
- `app/(auth)/register.tsx` — No changes needed (client only)

### Files to Create

- `app/(companion)/_layout.tsx` — Tab layout for companion
- `app/(companion)/index.tsx` — Companion dashboard
- `app/(companion)/incoming.tsx` — Incoming requests list
- `app/(companion)/history.tsx` — Request history
- `app/(companion)/profile.tsx` — Profile + logout

## Screens

### Companion Dashboard (`(companion)/index.tsx`)

- Greeting: "Hola, {firstName}"
- Stats cards:
  - Pendientes (orange) — requests with status `pending`
  - Aceptadas (green) — requests with status `accepted`
  - Completadas (blue) — requests with status `completed`
- Quick action: "Ver solicitudes entrantes"
- Pull-to-refresh
- Data: `requestApi.list()` (backend filters by companion role)

### Incoming Requests (`(companion)/incoming.tsx`)

- FlatList of requests with status `pending` directed to this companion
- Each card shows:
  - Service type (top left)
  - Client full name
  - Preferred date
  - Address
  - Notes (if any)
  - Two buttons: **Aceptar** (green) / **Rechazar** (red)
- Actions call `requestApi.accept(id)` or `requestApi.reject(id)`
- Optimistic UI: card removed from list immediately on action
- WebSocket subscription for real-time new requests (`request_created` event)
- Pull-to-refresh
- Empty state: "No hay solicitudes pendientes"

### Request History (`(companion)/history.tsx`)

- FlatList of requests with status `accepted`, `completed`, `rejected`, `cancelled`
- Filter chips: Todos | Aceptadas | Completadas | Rechazadas
- Each card shows:
  - Service type
  - Client full name
  - Preferred date
  - Status pill (color-coded)
- Pull-to-refresh
- Empty state: "No hay solicitudes en el historial"

### Companion Profile (`(companion)/profile.tsx`)

- User info card:
  - Nombre (first + last name)
  - Email
  - Rol: "Compania"
- Companion stats (from user data or future API):
  - Rating (stars)
  - Anios de experiencia
  - Idiomas
  - Servicios
- "Cerrar sesion" button (red) → `signOut()` → redirect to login

## API Endpoints Used

| Method | Endpoint | Used In |
|--------|----------|---------|
| GET | `/api/v1/requests/` | Dashboard, Incoming, History (backend filters by role) |
| POST | `/api/v1/requests/:id/accept` | Incoming |
| POST | `/api/v1/requests/:id/reject` | Incoming |
| GET | `/api/v1/users/me` | Profile |

## WebSocket Events

| Event | Handler |
|-------|---------|
| `request_created` | Add to incoming list |
| `request_accepted` | Remove from incoming, add to history |
| `request_rejected` | Remove from incoming, add to history |
| `request_cancelled` | Update status in both lists |
| `request_expired` | Remove from incoming, add to history |

## State Management

### Existing stores (no changes needed)

- `auth-store.ts` — Already stores `user` with `role`
- `request-store.ts` — Already stores `requests` array with role-based filtering

### New store (optional, for companion-specific state)

- No new store needed — reuse `request-store.ts` since backend filters by role

## Design Tokens

Follow existing theme in `src/theme/`:
- Primary: `#00668A`
- Success: `#22C55E`
- Error: `#EF4444`
- Warning: `#F97316`
- Lexend font family
- 8-point spacing scale

## Implementation Order

1. Create `(companion)/_layout.tsx` — Tab layout
2. Create `(companion)/index.tsx` — Dashboard
3. Create `(companion)/incoming.tsx` — Incoming requests with accept/reject
4. Create `(companion)/history.tsx` — History with filters
5. Create `(companion)/profile.tsx` — Profile + logout
6. Update `app/_layout.tsx` — Add role-based redirect
7. Update `app/(auth)/login.tsx` — Add role redirect after login
8. Test both flows (client + companion)

## QA Testing

### Companion Flow

1. Login with companion account (registered via web)
2. Verify redirect to companion tabs
3. Dashboard shows correct stats
4. Incoming requests list loads
5. Accept a request → card moves to history
6. Reject a request → card moves to history
7. Pull-to-refresh works
8. WebSocket updates appear in real-time
9. Profile shows companion info
10. Logout redirects to login

### Client Flow (regression)

1. Login with client account
2. Verify redirect to client tabs
3. All existing functionality works unchanged
