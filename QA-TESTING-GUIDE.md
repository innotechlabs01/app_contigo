# Contigo - Guia de QA Testing

## Acceso a la Aplicacion

### Requisitos Previos

1. **Expo Go** instalado en tu celular:
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
   - [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Conexion a internet** (necesaria para el tunnel de Cloudflare)

### URLs de Prueba

| Servicio | URL |
|----------|-----|
| **App Movil (Expo)** | `https://mobile.innotechlabssas.lat` |
| **Backend API** | `http://localhost:8082` |

### Como Conectar

1. Abre **Expo Go** en tu celular
2. Escanea el QR code o abre el link `https://mobile.innotechlabssas.lat`
3. La app se cargara automaticamente

---

## Flujo de la Aplicacion

### 1. Pantalla de Login

Al abrir la app por primera vez, se muestra el login.

**Campos:**
- Email (requerido)
- Contrasena (requerida)

**Acciones:**
- `Iniciar sesion` - Ingresa con credenciales existentes
- `Crear cuenta` - Navega al registro

**Validaciones:**
- Ambos campos son obligatorios
- Se muestra alerta si las credenciales son incorrectas

---

### 2. Registro (4 Pasos)

#### Paso 1 - Tus Datos
| Campo | Requerido | Notas |
|-------|-----------|-------|
| Nombre | Si | |
| Apellido | Si | |
| Email | Si | Debe ser unico |
| Telefono | No | |
| Contrasena | Si | Minimo 8 caracteres |

#### Paso 2 - Servicio
| Campo | Requerido | Opciones |
|-------|-----------|----------|
| Tipo de servicio | Si | "Acomp. Medico", "Compania Diaria", "Tramites" |
| Fecha preferida | Si | Selector de fecha |
| Direccion | Si | Domicilio del servicio |
| Notas | No | Detalles adicionales |

#### Paso 3 - Compania
> **Nota:** Este paso es un placeholder. Actualmente no permite seleccionar compania.

#### Paso 4 - Revisar
- Resumen de toda la informacion ingresada
- Boton `Registrarse` para completar

**Despues del registro:**
- Se crea la cuenta en Clerk (autenticacion)
- Se crea/sincroniza el usuario en el backend
- Se redirige a la pantalla principal (tabs)

---

### 3. Pantalla Principal (Tabs)

#### Tab 1: Inicio (Dashboard)
- Saludo personalizado: "Hola, {nombre}"
- Tarjetas de estadisticas:
  - **Pendientes** (naranja) - solicitudes con estado `pending`
  - **Aceptadas** (verde) - solicitudes con estado `accepted`
- Accion rapida: "Ver solicitudes"
- Pull-to-refresh para actualizar datos

#### Tab 2: Mis Solicitudes
- Lista de todas las solicitudes del usuario
- Cada solicitud muestra:
  - Tipo de servicio
  - Estado (color-coded):
    - `pending` = naranja
    - `accepted` = verde
    - `rejected` = rojo
    - `cancelled` = gris
    - `expired` = gris
    - `completed` = verde
  - Nombre completo del cliente
  - Fecha preferida
- Actualizaciones en tiempo real via WebSocket
- Estado vacio: "No hay solicitudes aun"
- Pull-to-refresh

#### Tab 3: Perfil
- Informacion del usuario:
  - Nombre completo
  - Email
  - Rol (por defecto: `client`)
- Boton `Cerrar sesion` (rojo)

---

## Estados de las Solicitudes

| Estado | Descripcion | Color |
|--------|-------------|-------|
| `pending` | Solicitud creada, esperando respuesta | Naranja |
| `accepted` | Compania acepto la solicitud | Verde |
| `rejected` | Solicitud rechazada | Rojo |
| `cancelled` | Solicitud cancelada | Gris |
| `expired` | Solicitud expirada | Gris |
| `completed` | Servicio completado | Verde |

---

## Escenarios de Prueba

### Flujo Completo de Registro

1. Abrir la app
2. Tocar "Crear cuenta"
3. Completar Paso 1 (datos personales)
4. Tocar "Siguiente"
5. Completar Paso 2 (seleccionar servicio, fecha, direccion)
6. Tocar "Siguiente"
7. Saltar Paso 3 (compania - placeholder)
8. Revisar resumen en Paso 4
9. Tocar "Registrarse"
10. Verificar que se redirige al Dashboard

### Flujo de Login

1. Abrir la app
2. Ingresar email y contrasena
3. Tocar "Iniciar sesion"
4. Verificar que se redirige al Dashboard
5. Verificar que el nombre del usuario aparece en el saludo

### Verificar Dashboard

1. Login exitoso
2. Verificar que aparece "Hola, {nombre}"
3. Verificar tarjetas de estadisticas (Pendientes/Aceptadas)
4. Verificar que pull-to-refresh funciona

### Verificar Lista de Solicitudes

1. Navegar a tab "Mis solicitudes"
2. Verificar que muestra solicitudes (o estado vacio)
3. Verificar colores de estado
4. Verificar pull-to-refresh

### Cerrar Sesion

1. Navegar a tab "Perfil"
2. Verificar info del usuario
3. Tocar "Cerrar sesion"
4. Verificar que redirige a login
5. Verificar que no se puede volver al dashboard sin login

### Verificar Navegacion

1. Login exitoso
2. Navegar entre las 3 tabs
3. Verificar que la tab activa se resalta
4. Verificar datos persistentes entre tabs

---

## Errores Conocidos / Limitaciones

1. **Seleccion de compania** no esta implementada (Paso 3 del registro)
2. **No hay boton de crear solicitud** desde el dashboard - solo se puede ver las existentes
3. **No hay vista de detalle** de solicitud
4. **No hay botones de accion** (aceptar/rechazar/cancelar) en las solicitudes
5. **No hay vista de compania** - la app solo funciona como cliente
6. **No hay vista de admin** - no hay panel de administracion
7. **No hay recuperacion de contrasena**
8. **No hay verificacion de email**

---

## Endpoints de la API (para pruebas manuales)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/users/me` | Crear/sincronizar usuario |
| GET | `/api/v1/companions` | Listar companias |
| POST | `/api/v1/requests/` | Crear solicitud |
| GET | `/api/v1/requests/` | Listar solicitudes del usuario |
| GET | `/api/v1/requests/:id` | Obtener solicitud por ID |
| POST | `/api/v1/requests/:id/accept` | Aceptar solicitud |
| POST | `/api/v1/requests/:id/reject` | Rechazar solicitud |
| POST | `/api/v1/requests/:id/cancel` | Cancelar solicitud |

### WebSocket

- URL: `ws://localhost:8082/api/v1/requests/ws`
- Eventos: `request_created`, `request_accepted`, `request_rejected`, `request_cancelled`, `request_expired`

---

## Datos de Prueba

### Usuario de Prueba
- **Email:** (usar el creado en el registro)
- **Contrasena:** (la definida en el registro)

### Servicios Disponibles
1. **Acomp. Medico** - Acompanamiento medico
2. **Compania Diaria** - Compania y cuidado diario
3. **Tramites** - Gestion de tramites

---

## Comandos Utiles

```bash
# Ver logs del backend
docker logs -f docker-api-1

# Ver logs del Expo
docker logs -f mobile-expo-expo-1

# Ver logs del tunnel
docker logs -f mobile-expo-tunnel-1

# Detener todo
./stop-qa.sh

# Iniciar todo
./start-qa.sh
```

---

## Soporte

- **Backend:** `http://localhost:8082/health` - verificar que responde `{"success":true,"data":{"status":"alive"}}`
- **Tunnel:** Verificar que `mobile.innotechlabssas.lat` carga correctamente
