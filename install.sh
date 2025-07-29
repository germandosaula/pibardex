#!/bin/bash

echo "🎮 Pibardex - Instalador Automático"
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
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

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_info "Iniciando instalación de Pibardex..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi
print_status "Node.js $(node --version) encontrado"

# 2. Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado."
    exit 1
fi
print_status "npm $(npm --version) encontrado"

# 3. Instalar dependencias del frontend
print_info "Instalando dependencias del frontend..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencias del frontend instaladas"
else
    print_error "Error instalando dependencias del frontend"
    exit 1
fi

# 4. Instalar dependencias del backend
print_info "Instalando dependencias del backend..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencias del backend instaladas"
else
    print_error "Error instalando dependencias del backend"
    exit 1
fi

# 5. Verificar Homebrew
cd ..
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew no está instalado"
    print_info "¿Deseas instalar Homebrew? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Agregar Homebrew al PATH
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
        
        print_status "Homebrew instalado"
    else
        print_warning "Homebrew no instalado. Necesitarás instalarlo manualmente para MongoDB."
    fi
fi

# 6. Verificar e instalar MongoDB
if command -v brew &> /dev/null; then
    if ! brew list mongodb-community &> /dev/null; then
        print_info "¿Deseas instalar MongoDB? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_info "Instalando MongoDB..."
            brew tap mongodb/brew
            brew install mongodb-community
            print_status "MongoDB instalado"
            
            print_info "Iniciando MongoDB..."
            brew services start mongodb-community
            print_status "MongoDB iniciado"
        fi
    else
        print_status "MongoDB ya está instalado"
        
        # Verificar si está corriendo
        if ! brew services list | grep mongodb-community | grep started &> /dev/null; then
            print_info "Iniciando MongoDB..."
            brew services start mongodb-community
        fi
        print_status "MongoDB está corriendo"
    fi
fi

# 7. Configurar archivos de entorno
if [ ! -f "backend/.env" ]; then
    print_info "Creando archivo .env para el backend..."
    cp backend/.env.example backend/.env
    print_status "Archivo .env creado"
fi

# 8. Poblar base de datos (si MongoDB está disponible)
if command -v mongosh &> /dev/null || nc -z localhost 27017 2>/dev/null; then
    print_info "¿Deseas poblar la base de datos con datos de ejemplo? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cd backend
        npm run seed
        cd ..
        print_status "Base de datos poblada con datos de ejemplo"
    fi
else
    print_warning "MongoDB no está disponible. Puedes poblar la base de datos más tarde con: cd backend && npm run seed"
fi

echo ""
print_status "¡Instalación completada!"
echo ""
print_info "Para iniciar el proyecto:"
echo "  1. Backend: cd backend && npm run dev"
echo "  2. Frontend: npm run dev"
echo ""
print_info "O usa el script de inicio: cd backend && ./start.sh"
echo ""
print_info "URLs:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend: http://localhost:5000"
echo ""
print_info "Para más información, consulta SETUP.md"