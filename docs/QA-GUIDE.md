# Guia de Pruebas - Contigo Mobile

> **Objetivo:** Esta guia te ayudara a probar la app Contigo en tu telefono. Sigue los pasos en orden.

---

## Que es Contigo?

Contigo es una plataforma que conecta personas que necesitan ayuda (clientes) con companeros especializados en servicios de cuidado y acompanamiento.

---

## Requisitos Previos

| Requisito | Detalle |
|-----------|---------|
| **Telefono** | iPhone (iOS 15+) o Android (API 30+) |
| **Internet** | Conexion WiFi o datos moviles estables |
| **Almacenamiento** | Al menos 100 MB libres |
| **Tiempo** | ~10 minutos para configurar |

---

## Paso 1: Instalar Expo Go

**Expo Go** es la app que permite ejecutar aplicaciones en desarrollo. Es gratuita y segura.

### iPhone (iOS)
1. Busca el icono **App Store** en tu telefono
2. Toca en la barra de busqueda (abajo)
3. Escribe **"Expo Go"**
4. Toca **"Obtener"** al lado del icono
5. Confirma con Face ID, Touch ID o tu contrasena
6. Espera a que se instale

### Android
1. Busca el icono **Google Play Store** en tu telefono
2. Toca en la barra de busqueda (arriba)
3. Escribe **"Expo Go"**
4. Toca **"Instalar"**
5. Espera a que se instale

> **Verificacion:** Despues de instalar, veras un icono nuevo llamado **"Expo Go"** en tu pantalla de inicio.

---

## Paso 2: Abrir la App de Contigo

### Opcion A: Enlace directo (mas facil)

1. Copia este enlace:
   ```
   exp://h_gioza-innotechlabssas-8082.exp.direct
   ```

2. Abre el **navegador** de tu telefono (Safari en iPhone, Chrome en Android)

3. **Pega el enlace** en la barra de direcciones

4. Toca **"Ir"** o **"Entrar"**

5. Se abrira automaticamente en **Expo Go**

> **Importante:** Si es la primera vez que usas Expo Go, podria pedirte permisos. Acepta todos.

### Opcion B: Escanear QR Code (alternativa)

1. Abre la app **Expo Go**
2. Toca el icono de **"Scan"** o **"Escanear"** (arriba a la derecha)
3. Apunta la camara al codigo QR que te compartieron
4. La app se abrira automaticamente

---

## Paso 3: Iniciar Sesion

Una vez que la app se abra:

1. Veras la pantalla de **Login**
2. Ingresa tu **correo electronico**
3. Ingresa tu **contrasena**
4. Toca **"Iniciar Sesion"**

### Credenciales de Prueba

Usa una de estas cuentas para iniciar sesion:

#### Cuenta de Cliente
| Campo | Valor |
|-------|-------|
| **Email** | `qa-client@contigo.test.com` |
| **Contrasena** | `ContigoQA2024!` |

#### Cuenta de Companion
| Campo | Valor |
|-------|-------|
| **Email** | `qa-companion@contigo.test.com` |
| **Contrasena** | `ContigoQA2024!` |

> **Nota:** Estas son cuentas de prueba. No uses credenciales reales.

---

## Paso 4: Explorar la App

### Pantalla Principal (Home)
- **Arriba:** Muestra tu nombre y un saludo
- **Medio:** Estadisticas de tus solicitudes (pendientes, aceptadas)
- **Abajo:** Botones de accion rapida

### Pantalla de Companions
- Lista de companeros disponibles
- Puedes ver informacion de cada uno (nombre, experiencia, servicios)

### Pantalla de Solicitudes
- Historial de tus solicitudes de servicio
- Estado de cada solicitud (pendiente, aceptada, rechazada, completada)

### Pantalla de Perfil
- Tu informacion personal
- Opcion para cerrar sesion

---

## Funcionalidades a Probar

Marca con una **X** cada prueba que realices:

### Login y Seguridad
- [ ] Puedo iniciar sesion con credenciales validas
- [ ] Aparece error con credenciales invalidas
- [ ] Puedo cerrar sesion correctamente
- [ ] Al cerrar sesion, debo volver a ingresar credenciales

### Home Screen
- [ ] Muestra mi nombre correctamente
- [ ] Muestra las estadisticas actualizadas
- [ ] Los botones de accion funcionan

### Companions
- [ ] La lista de companions se carga (no queda en blanco)
- [ ] Puedo ver los detalles de un companion
- [ ] La informacion es correcta (nombre, servicios, etc.)

### Solicitudes
- [ ] Puedo crear una nueva solicitud
- [ ] La solicitud aparece en mi lista
- [ ] Puedo ver el estado de mis solicitudes
- [ ] Puedo cancelar una solicitud pendiente

### Navegacion
- [ ] Puedo moverme entre pantallas sin problemas
- [ ] El boton de "atras" funciona correctamente
- [ ] No hay pantallas en blanco o con errores

---

## Reportar Bugs

Si encuentras un error, envia un reporte con esta informacion:

### Template de Reporte

**Titulo:** [Breve descripcion del error]

**Pasos para reproducir:**
1. Abro la app
2. Voy a...
3. Toco en...
4. [Que hice]

**Comportamiento esperado:** [Que deveria pasar]

**Comportamiento actual:** [Que paso realmente]

**Captura de pantalla:** [Si es posible, adjunta imagen]

**Dispositivo:** [iPhone/Android, modelo]

**Version:** [Version de Expo Go si la conoces]

### Ejemplo

**Titulo:** No se muestra la lista de companions

**Pasos para reproducir:**
1. Abro la app
2. Inicio sesion
3. Voy a la pantalla de Companions
4. La lista queda en blanco

**Comportamiento esperado:** Deberia mostrar la lista de companeros disponibles

**Comportamiento actual:** La pantalla carga pero no muestra nada

**Captura de pantalla:** [adjunta imagen]

**Dispositivo:** iPhone 14, iOS 17

---

## Informacion Tecnica

| Componente | URL | Estado |
|------------|-----|--------|
| **Backend API** | `https://unlike-config-hiking-park.trycloudflare.com` | Activo |
| **WebSocket** | `wss://unlike-config-hiking-park.trycloudflare.com` | Activo |

> **Nota tecnica:** El backend esta desplegado temporalmente. Si hay problemas de conexion, puede ser que el servidor este reiniciandose.

---

## Preguntas Frecuentes

### La app no se abre con el enlace
- Verifica que tengas **Expo Go** instalado
- Asegurate de copiar el enlace completo
- Prueba copiando y pegando en el navegador

### La app carga muy lento
- Es normal en la **primera carga** (puede tomar 30-60 segundos)
- Verifica tu conexion a internet
- Si no carga en 2 minutos, reinicia la app

### Aparece un error de conexion
- Verifica que tengas **internet**
- El servidor podria estar reiniciandose, espera 1 minuto y vuelve a intentar

### No puedo iniciar sesion
- Verifica que tus credenciales sean correctas
- Si olvidaste tu contrasena, contacta al equipo de desarrollo

---

## Contacto

Si tienes problemas tecnicos o dudas:

- **Equipo de desarrollo:** [Agregar contacto]
- **Slack/WhatsApp:** [Agregar canal]

---

## Notas Finales

- **Tiempo estimado de pruebas:** 30-60 minutos
- **Prioridad:** Probar las funcionalidades principales primero
- **No dudes en preguntar** si algo no esta claro

**Gracias por tu ayuda en las pruebas!**
