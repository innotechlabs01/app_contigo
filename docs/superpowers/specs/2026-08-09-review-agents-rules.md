# Contigo Review Agents & Workflow Rules — Design Spec

## Overview

Crear un sistema de revisión obligatoria antes de cualquier cambio en el monorepo Contigo. Se definen agentes especializados de opencode (arquitecto, dev-ux, dev-frontend, dev-backend, dev-flutter, qa, hacker) y una regla de workflow que obliga al agente principal a consultarlos antes de escribir código.

**Objetivo:** Ningún cambio se implementa sin que el arquitecto y el dev del stack afectado lo hayan revisado. Después de implementar, QA valida y Hacker revisa seguridad.

---

## Architecture

### Ubicación

```
contigo/
├── .opencode/
│   └── agent/
│       ├── arquitecto.md       # Revisa arquitectura y coherencia con specs
│       ├── dev-ux.md           # Revisa UI/UX, diseño y estándares visuales
│       ├── dev-frontend.md     # Revisa apps/web (Next.js)
│       ├── dev-backend.md      # Revisa apps/backend (Go)
│       ├── dev-flutter.md      # Revisa apps/mobile (Flutter)
│       ├── qa.md               # Prueba todo lo realizado
│       └── hacker.md           # Busca vulnerabilidades
└── AGENTS.md                   # Regla de workflow (auto-cargado por opencode)
```

### Características de los agentes

- **Mode:** `subagent` — se invocan desde el agente principal para revisar.
- **Permission:** `edit: deny` — solo revisan, nunca editan.
- **Model:** el configurado por defecto en opencode (no se fija uno específico).
- Cada agente tiene un `description` que indica cuándo invocarlo y un prompt con su experticia enfocada en su stack.

| Agente | Description / cuándo invocar |
|--------|------------------------------|
| `arquitecto` | Antes de cualquier cambio: valida arquitectura, clean architecture, coherencia con `specs/`, decisiones técnicas, impacto entre apps |
| `dev-ux` | Cuando el cambio toca UI/UX o diseño en cualquier app: valida estándares visuales, design system, accesibilidad y mejores prácticas de diseño (verificadas con context7), informando al frontend |
| `dev-frontend` | Cuando el cambio toca `apps/web` (Next.js 14, React 18, Tailwind, Supabase, Radix UI) |
| `dev-backend` | Cuando el cambio toca `apps/backend` (Go 1.26, Fiber, clean architecture, handlers, repos, WebSocket, Clerk JWT) |
| `dev-flutter` | Cuando el cambio toca `apps/mobile` (Flutter 3.35+, Material 3, Feature-First, Riverpod 3.x, go_router, Dio, Freezed) |
| `qa` | Después de implementar: ejecuta tests, lint y verifica que todo funcione |
| `hacker` | Cuando hay auth, datos sensibles, endpoints, subidas de archivos, pagos o cambios de infraestructura: busca vulnerabilidades (OWASP Top 10) |

---

## Workflow Rule (AGENTS.md)

El archivo `AGENTS.md` en la raíz del monorepo contiene la regla de workflow. Es auto-cargado por opencode en cada sesión. La regla:

1. **Antes de escribir código**, el agente principal DEBE invocar al subagente `arquitecto` y al dev del stack afectado:
   - Cambio en `apps/web` → `dev-frontend` (+ `dev-ux` si involucra UI/UX o diseño)
   - Cambio en `apps/backend` → `dev-backend`
   - Cambio en `apps/mobile` → `dev-flutter` (+ `dev-ux` si involucra UI/UX o diseño)
   - Cambio que toca varios stacks → consultar todos los afectados
2. Los revisores pueden aprobar, sugerir cambios o rechazar. El agente principal NO edita hasta que el arquitecto y el dev afectado aprueben (o el usuario lo autorice explícitamente).
3. **Después de implementar**, invocar a `qa` para validar tests/lint/funcionamiento.
4. Si el cambio involucra auth, datos sensibles, subidas de archivos, endpoints públicos o infraestructura, invocar a `hacker` para revisión de seguridad.
5. Los resultados de las revisiones se resumen al usuario antes de continuar.

---

## Error Handling

- Si un revisor rechaza un cambio, el agente principal presenta el motivo al usuario y espera decisión (corregir, continuar de todos modos o descartar).
- Si no hay revisor disponible para un stack (no configurado), se documenta y se continúa con el resto de la cadena de revisión.

---

## Testing Strategy

- `qa` ejecuta los comandos reales de cada app:
  - Web: `npm run lint`, `npm run build`
  - Backend: `go test ./...`, `make lint`
  - Mobile: `flutter analyze`, `flutter test`
- Los agentes de revisión son solo configuración (markdown), no tienen tests unitarios. La validación se hace abriendo una sesión de opencode y verificando que los agentes aparezcan y respondan.

---

## Decisions Summary

| Decisión | Elección | Racional |
|----------|----------|----------|
| Forma de las reglas | Agentes de opencode | Se integran con la herramienta, invocables con @ |
| Modo de revisión | Automático antes de cada cambio | Disciplina garantizada |
| Ubicación | `.opencode/agent/` en raíz | Estándar de opencode, se detecta automáticamente |
| Permisos de revisores | `edit: deny` | Solo revisan, nunca modifican |
| Roles extra | QA + Hacker | Pruebas y seguridad cubiertas |
| Regla de workflow | `AGENTS.md` raíz | Auto-cargado en cada sesión de opencode |
