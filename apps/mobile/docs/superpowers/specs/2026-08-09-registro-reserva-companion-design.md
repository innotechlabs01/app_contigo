# Registro de Cliente + Reserva dirigida a Companion — Design

Fecha: 2026-08-09
Stack afectado: mobile (Flutter) + backend (Go)

## Objetivo

Permitir que un cliente se registre desde el login (botón "Registrar"), cree su cuenta
con Clerk real (no mock), se guarde como cliente en el backend, y en el mismo flujo
cree una reserva dirigida a un companion específico que él elige. Solo ese companion
recibe la reserva (vía WebSocket); si no la acepta dentro del timeout, se cancela
automáticamente y el cliente es notificado.

## Decisiones aprobadas por el usuario

1. **Auth real con Clerk** (no mock demo). Se usa la publishable key inyectada con `--dart-define=CLERK_PUBLISHABLE_KEY`.
2. **Registro + reserva en un solo flujo** multi-paso (reutilizando patrón de `ContigoStepper`).
3. **Campos: datos del cliente + servicio**.
4. **Reserva dirigida**: el cliente filtra y elige al companion; solo ese companion ve la reserva.
5. **Listado real de companions** vía endpoint backend `GET /companions`.
6. **Timeout automático**: si el companion no acepta en N minutos, la reserva pasa a `expired` y se notifica al cliente por WS. El cliente también puede cancelar manualmente.

## Flujo UX (mobile)

Ruta: desde `login_screen.dart` se agrega botón **"Registrar"** (ContigoButton secondary)
que navega a `/register` (`AppRoutes.register`).

Pantalla `RegisterScreen` con `ContigoStepper` de 4 pasos:

1. **Tus datos** — nombre completo, email, teléfono, contraseña (+ confirmar).
   - Inputs `ContigoInput` con label siempre visible (design system: no placeholder-only).
2. **El servicio** — tipo de servicio (médico / compañía diaria / trámites), fecha preferida,
   dirección, punto de encuentro (opcional), notas (opcional).
   - Reutiliza los mismos campos de `RequestFormData` (`request_form_view_model.dart`).
3. **Tu acompañante** — listado de companions desde `GET /companions` con filtro
   (por servicio/experiencia/idioma), tarjetas con foto, nombre, rating, experiencia.
   - Selección única; tarjeta seleccionada con `surface-container-high` (sin checkmark, per design system).
4. **Revisar y registrar** — resumen de datos + botón primario "Crear cuenta y reservar".

### Submisión (paso 4)

En `RegisterViewModel`:
1. `Auth.attemptSignUp` (clerk_auth) con email/password + firstName/lastName + metadata (`role: client`, `phone`).
2. Guardar sesión real (token de `sessionTokenStream`) en secure storage via `ClerkAuthDatasource`.
3. Llamar backend `POST /users/me` (o el endpoint de registro) para crear/confirmar el cliente (id = clerk sub).
4. Llamar `POST /requests` con `companion_id` del elegido + datos del servicio.
5. `authGuard.authenticate()` + navegar a `/home` (mis solicitudes).

### Estado de errores

- Si el email ya existe en Clerk → mensaje claro ("Ya existe una cuenta con ese correo").
- Si el companion ya no está disponible → error del backend y volver al paso 3.
- Si expira el timeout mientras el cliente está en la pantalla de éxito → la tarjeta se actualiza vía WS a `expired`.

## Backend

### Nuevo: listado de companions

- `GET /api/v1/companions` (protegido con Clerk). Devuelve usuarios con rol `companion`
  (foto, nombre, experiencia, rating, idiomas, servicios). Implementa el módulo `users`
  (hoy solo tiene entidad e interfaz): repositorio, use case, handler, ruta.
- Seed: poblar 3-5 companions de prueba en `users` + `user_roles` (rol companion).

### Cambios en `requests`

- `CreateRequestInput` agrega `companion_id` (required).
- `RequestUseCase.Create`:
  - valida que el companion exista y esté activo;
  - guarda `companion_id` en la reserva;
  - en vez de `Hub.Broadcast`, usa `Hub.SendToUser(companionID, request_created)` → **solo el companion elegido la ve**.
  - inicia timer de expiración.
- Nuevo status `expired` y `cancelled`:
  - Timer (goroutine + `time.After`) que marca la reserva como `expired` si sigue `pending` pasados N minutos (config, default 15).
  - Notifica al cliente (`SendToUser(clientID, request_expired)`).
  - `POST /requests/:id/cancel` (cliente) → `cancelled`, notifica al companion.
- WebSocket: nuevos eventos `request_expired` y `request_cancelled` (además de `request_created` dirigido).
- `ListByCompanion` debe devolver también las `pending` dirigidas a ese companion (hoy `role=pending` devuelve todas).

### Entidades/eventos

- `ServiceRequest` ya tiene `CompanionID`. Se agregan status `expired`/`cancelled`.
- `WsEvent` en mobile: agregar `RequestExpired`, `RequestCancelled` y manejar `request_created` dirigido (ya escucha `companion_requests_view_model.dart`).

## Design System — "The Empathetic Anchor"

- Colores: `primary` #00668A, `primary-container` #85cdf7, `surface` #f9f9f9,
  `surface-container-low` #f3f3f3, `surface-container-lowest` #ffffff, `on-surface` #1a1c1c.
- Tipografía: Lexend (display/headlines/body, body-lg 1rem, line-height ≥1.6) + Plus Jakarta Sans (labels).
- **Sin bordes 1px** ni divisores: separar con fondos/tonos y espaciado 1rem.
- Botones primarios: gradiente 135° primary→primary-container, min-height 56px, radius `xl` 3rem, scale 0.98 on press.
- Cards: `surface-container-lowest`, radius 1rem, sombra flotante `0 12px 32px rgba(0,102,138,0.08)`.
- Inputs: labels siempre visibles, `surface-container-highest`.
- Selección activa: `surface-container-high` (sin checkmarks).
- Glassmorphism 70% opacity + 20px blur para el header del paso 3 (companion).

## Archivos afectados (mobile)

- `core/router/routes.dart` + `router.dart`: nueva ruta `/register`.
- `features/auth/presentation/screens/login_screen.dart`: botón "Registrar".
- `features/auth/presentation/screens/register_screen.dart`: **nuevo** (stepper 4 pasos).
- `features/auth/presentation/view_models/register_view_model.dart`: **nuevo** (sign-up Clerk + crear cliente + reserva).
- `features/auth/data/datasources/clerk_auth_datasource.dart`: sign-up real con `clerk_auth` (reemplaza `signInWithEmail` mock, conserva `signIn` real).
- `features/client/data/datasources/request_api_datasource.dart`: enviar `companion_id`; parsear `expired/cancelled`.
- `features/companion/data/...`: datasource/repo/usecase de listado de companions.
- `core/ws/ws_event.dart` + `core/ws/ws_provider.dart`: eventos `request_expired`, `request_cancelled`.
- `core/di/providers.dart`: providers del nuevo datasource/repo de companions y del `Auth` de clerk.
- `main.dart`: inicializar `Auth` de clerk con publishable key.

## Archivos afectados (backend)

- `internal/users/...`: implementar repositorio, use case, handler, ruta (`GET /companions`, `POST /users/me`).
- `internal/requests/application/usecase/request_usecase.go`: `companion_id`, validación, timer expiración, cancel.
- `internal/requests/interfaces/http/route/request_route.go`: `POST /:id/cancel`.
- `internal/requests/ws/hub.go`: ya tiene `SendToUser` — se reutiliza para dirigido + expired/cancelled.
- `internal/requests/data/repository/request_repository_impl.go`: status expired/cancelled, listar pending por companion.
- `cmd/server/main.go`: registrar rutas de `users`/`companions`; pasar config de timeout.
- Migración/schema: `users` ya existe; agregar rol companion + seed de companions.

## Verificación

- Backend: `go test ./...`, `make lint`.
- Mobile: `flutter analyze`, `flutter test` (añadir tests de RegisterViewModel con mock de clerk).
- E2E manual: registrar cliente nuevo → elegir companion → el companion (2º app) ve la reserva al instante;
  si no acepta en el timeout → cliente ve `expired`.
