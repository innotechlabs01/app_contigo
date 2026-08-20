#!/bin/bash
# Contigo - Levantar backend + mobile para QA
# Uso: ./start-qa.sh

set -e

echo "🚀 Iniciando Contigo para QA..."

# Levantar backend
echo "📦 Levantando backend..."
cd apps/backend/deploy/docker
docker compose up -d --build
cd ../../..

# Levantar mobile-expo con tunnel
echo "📱 Levantando mobile-expo con Cloudflare tunnel..."
cd apps/mobile-expo
docker compose up -d --build
cd ../..

echo ""
echo "✅ Todo levantado!"
echo ""
echo "📋 Servicios:"
echo "   Backend API:  http://localhost:8082"
echo "   Mobile Expo:  http://localhost:8098"
echo "   Tunnel:       mobile.innotechlabssas.lat"
echo ""
echo "🔍 Ver logs:"
echo "   docker logs -f docker-api-1"
echo "   docker logs -f mobile-expo-expo-1"
echo "   docker logs -f mobile-expo-tunnel-1"
echo ""
echo "🛑 Para detener: ./stop-qa.sh"
