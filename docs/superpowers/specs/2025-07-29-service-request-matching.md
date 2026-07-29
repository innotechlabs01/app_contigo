# Service Request Matching — Client ↔ Companion

## Problem

Two roles (client, companion) in the same app need a real-time matching flow:
1. Client selects a companion and sends a service request
2. Companion receives the request in real-time and accepts or rejects
3. Both see the confirmed reservation

## Architecture

```
┌─────────────────────┐     REST (HTTP)        ┌──────────────────────┐
│  Flutter App         │◄──────────────────────►│  Go Backend          │
│                      │                        │  (Fiber v3)          │
│  Rol: Client         │◄──── WebSocket ───────►│                      │
│  Rol: Companion      │     (eventos push)     │  ┌────────────────┐  │
│                      │                        │  │ WebSocket Hub  │  │
│  Misma app,          │                        │  │ (en memoria)   │  │
│  rutas separadas     │                        │  └────────────────┘  │
│  por rol             │                        │  ┌────────────────┐  │
└─────────────────────┘                        │  │ Turso/SQLite   │  │
                                                │  │ (libsql)       │  │
                                                │  └────────────────┘  │
                                                └──────────────────────┘
```

- Misma app Flutter con dos shells (ya existe: StatefulShellRoute para cliente, ShellRoute para companion)
- Backend Fiber v3 (ya existe)
- Auth via Clerk JWT (ya existe)
- BD: Turso en prod, SQLite local con `file:./contigo.db` para dev

## Data Model

Nueva migración `000013_create_service_requests`:

```sql
CREATE TABLE service_requests (
    id             TEXT PRIMARY KEY,
    client_id      TEXT NOT NULL REFERENCES users(id),
    companion_id   TEXT NOT NULL REFERENCES users(id),
    service_type   TEXT NOT NULL,
    full_name      TEXT NOT NULL,
    phone          TEXT NOT NULL,
    address        TEXT NOT NULL,
    meeting_point  TEXT,
    preferred_date TEXT NOT NULL,
    notes          TEXT,
    status         TEXT NOT NULL DEFAULT 'pending',
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_service_requests_client ON service_requests(client_id);
CREATE INDEX idx_service_requests_companion ON service_requests(companion_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
```

Status values: `pending | accepted | rejected | cancelled | completed`

## REST API (Fiber, bajo `/api/v1`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/requests` | Bearer JWT | Client crea solicitud |
| GET | `/requests` | Bearer JWT | Lista según rol (client → propias, companion → hacia él) |
| GET | `/requests/:id` | Bearer JWT | Detalle |
| POST | `/requests/:id/accept` | Bearer JWT | Companion acepta |
| POST | `/requests/:id/reject` | Bearer JWT | Companion rechaza |
| WS | `/ws` | Query param `token` | WebSocket persistente |

### Request/Response examples

**POST /api/v1/requests**
```json
{
  "companion_id": "user_456",
  "service_type": "accompaniment",
  "full_name": "Juan Pérez",
  "phone": "+56912345678",
  "address": "Av. Providencia 1234",
  "meeting_point": "Café del lobby",
  "preferred_date": "2025-07-30T18:00:00",
  "notes": "Entrada por calle lateral"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "id": "srq_abc123",
    "status": "pending",
    "client_id": "user_123",
    "companion_id": "user_456",
    ...
  }
}
```

## WebSocket Protocol

### Conexión
```
ws://localhost:8080/ws?token=<JWT_CLERK>
```

### Mensajes Cliente → Servidor

**join**: Registrar rol del usuario conectado
```json
{ "type": "join", "role": "client" | "companion" }
```

### Mensajes Servidor → Cliente

**request_pending**: Nueva solicitud (→ companion elegido)
```json
{
  "type": "request_pending",
  "request": { "id": "srq_abc123", "client_name": "Juan Pérez", ... }
}
```

**request_accepted**: Solicitud aceptada (→ cliente + companion)
```json
{
  "type": "request_accepted",
  "request": { "id": "srq_abc123", "status": "accepted", ... }
}
```

**request_rejected**: Solicitud rechazada (→ cliente)
```json
{
  "type": "request_rejected",
  "request": { "id": "srq_abc123", "status": "rejected", ... }
}
```

## Flujo Completo

```
Cliente                          Backend                        Companion
  │                                │                                │
  │── POST /api/v1/requests ──────►│                                │
  │   { companion_id, ... }        │                                │
  │                                │── guarda en DB ────────────────│
  │                                │                                │
  │                                │── WS: request_pending ────────►│
  │                                │   (a user_456)                 │
  │◄─── 201 Created ───────────────│                                │
  │                                │                                │
  │                                │           Companion ve detalle │
  │                                │◄── POST /requests/:id/accept ──│
  │                                │                                │
  │◄── WS: request_accepted ───────│                                │
  │   (a user_123)                 │── WS: request_accepted ───────►│
  │                                │   (a user_456)                 │
  │                                │                                │
  │       ┌──────────────────┐     │         ┌──────────────────┐   │
  │       │ Reserva          │     │         │ Reserva          │   │
  │       │ Confirmada       │     │         │ Confirmada       │   │
  │       └──────────────────┘     │         └──────────────────┘   │
```

## Mobile Implementation

### WebSocket Provider (Riverpod)
- `WebSocketNotifier` mantiene la conexión persistente
- Se autentica con el JWT de Clerk
- Expone un `Stream<ServerEvent>` que los screens escuchan
- Reconnect automático en caso de caída

### Client Flows
- **ServiceTypeScreen**: Selecciona tipo de servicio
- **CompanionSelectionScreen**: Lista companions disponibles → selecciona uno
- **RequestFormScreen**: Datos personales, fecha, meeting point (ya existe)
- **MyRequestsScreen**: Lista solicitudes con estado en vivo vía WS
- Cuando el companion acepta → el status cambia de `pending` a `accepted` en tiempo real

### Companion Flows
- **CompanionRequestsTab**: Recibe WS `request_pending` → muestra solicitud entrante con botones Aceptar/Rechazar
- **CalendarTab**: Solicitudes aceptadas (sesiones programadas)
- Cuando acepta → ve la reserva confirmada

### Request Status Updates
- Cada screen usa `StreamProvider` que escucha eventos WS filtrados por `userId`
- Cuando llega `request_accepted` o `request_rejected`, el provider actualiza el estado
- La UI se reconstruye automáticamente

## Backend Implementation

### Nuevos archivos en `internal/requests/`

```
internal/requests/
├── domain/
│   ├── entity/
│   │   └── service_request.go        # struct con tags json
│   └── repository/
│       └── request_repository.go     # interface
├── interfaces/
│   └── http/
│       ├── handler/
│       │   └── request_handler.go    # Create, List, Get, Accept, Reject
│       └── route/
│           └── request_route.go      # Register routes bajo /api/v1
└── application/
    └── usecase/
        └── request_usecase.go        # lógica de negocio
```

### WebSocket Hub (`internal/ws/hub.go`)
- Mapa `map[string]map[string]*websocket.Conn` (userId → connId → conn)
- Métodos: `Register`, `Unregister`, `SendToUser`, `SendToUsers`
- Hilo seguro con `sync.RWMutex`
- Broadcast a cliente y companion cuando cambia un status

### Handler: request_handler.go
- `Create`: Valida → guarda en DB → envía WS al companion → responde 201
- `Accept`: Verifica que sea el companion asignado → update status → envía WS a ambos
- `Reject`: update status → envía WS al cliente
- `List`: Filtra por role (clientId o companionId según el JWT)

### Dependencias Go a agregar
- `github.com/gofiber/contrib/websocket` para WebSocket
- `github.com/gofiber/contrib/fiberzap` (opcional, logs)
- `github.com/google/uuid` para generar IDs

## Testing

### Backend
- Unit tests para use case (crear, aceptar, rechazar)
- Integration tests con SQLite in-memory
- WS hub tests con conexiones simuladas

### Mobile
- Unit tests para WebSocket provider
- Widget tests para CompanionRequestsTab con estado mockeado
- Integration test del flujo completo (crear request → recibir WS → aceptar)

## Production Path

| Componente | Local (demo noche) | Producción |
|-----------|-------------------|------------|
| BD | `file:./contigo.db` | Turso remote |
| WS Hub | Memoria (única instancia) | Memoria + Redis pub/sub si escala a multi-instancia |
| .env | `DATABASE_URL=file:./contigo.db` | `DATABASE_URL=libsql://...` + `TURSO_DB_TOKEN=...` |

Sin cambios de código ni migraciones para el deploy. Solo variables de entorno.
