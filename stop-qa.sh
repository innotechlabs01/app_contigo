#!/bin/bash
# Contigo - Detener todos los servicios de QA
# Uso: ./stop-qa.sh

set -e

echo "🛑 Deteniendo Contigo..."

# Detener mobile-expo
echo "📱 Deteniendo mobile-expo..."
cd apps/mobile-expo
docker compose down
cd ../..

# Detener backend
echo "📦 Deteniendo backend..."
cd apps/backend/deploy/docker
docker compose down
cd ../../..

echo "✅ Todo detenido!"
