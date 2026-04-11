## 📂 5. component_architecture.md
### Estructura Next.js (Clean Architecture)
- `src/components/ui/`: Componentes atómicos (Button, Input, Stepper).
- `src/modules/onboarding/`: Lógica de negocio y formularios.
- `src/hooks/`: `useOnboardingStore` (Zustand para persistencia entre pasos).
- `src/services/`: Clientes API para subida de archivos/videos.