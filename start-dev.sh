#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "🎮 Iniciando Pibardex..."
echo "======================"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "No se encontró la estructura del proyecto. Asegúrate de estar en el directorio raíz."
    exit 1
fi

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    print_warning "Dependencias del frontend no instaladas. Ejecutando npm install..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    print_warning "Dependencias del backend no instaladas. Ejecutando npm install..."
    cd backend && npm install && cd ..
fi

# Verificar MongoDB
if ! nc -z localhost 27017 2>/dev/null; then
    print_warning "MongoDB no está corriendo en localhost:27017"
    print_info "Intentando iniciar MongoDB..."
    
    if command -v brew &> /dev/null; then
        brew services start mongodb-community 2>/dev/null
        sleep 2
        
        if nc -z localhost 27017 2>/dev/null; then
            print_status "MongoDB iniciado correctamente"
        else
            print_warning "No se pudo iniciar MongoDB automáticamente"
            print_info "Consulta SETUP.md para instrucciones de instalación"
        fi
    else
        print_warning "Homebrew no encontrado. Consulta SETUP.md para instalar MongoDB"
    fi
else
    print_status "MongoDB está corriendo"
fi

# Función para manejar la señal de interrupción
cleanup() {
    print_info "Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

print_info "Iniciando backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend se inicie
sleep 3

print_info "Iniciando frontend..."
npm run dev &
FRONTEND_PID=$!

print_status "¡Servicios iniciados!"
echo ""
print_info "URLs disponibles:"
echo "  🌐 Frontend: http://localhost:5173"
echo "  🔧 Backend:  http://localhost:5000"
echo "  ❤️  Health:   http://localhost:5000/api/health"
echo ""
print_info "Presiona Ctrl+C para detener ambos servicios"

# Esperar a que terminen los procesos
wait $BACKEND_PID $FRONTEND_PID