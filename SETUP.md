# 🚀 Guía de Instalación de Pibardex

## Prerrequisitos

### 1. Instalar Homebrew (Gestor de paquetes para macOS)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar MongoDB
```bash
# Agregar el repositorio de MongoDB
brew tap mongodb/brew

# Instalar MongoDB Community Edition
brew install mongodb-community

# Iniciar MongoDB como servicio
brew services start mongodb-community
```

### 3. Verificar instalación de MongoDB
```bash
# Verificar que MongoDB está corriendo
brew services list | grep mongodb

# Conectar a MongoDB (opcional)
mongosh
```

## Instalación del Proyecto

### 1. Instalar dependencias del Frontend
```bash
cd /Users/germandosaulaces/Desktop/pibardex
npm install
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno del Backend
```bash
cd backend
cp .env.example .env
```

### 4. Poblar la base de datos con datos de ejemplo
```bash
cd backend
npm run seed
```

## Ejecutar el Proyecto

### Opción 1: Ejecutar Frontend y Backend por separado

#### Terminal 1 - Backend
```bash
cd /Users/germandosaulaces/Desktop/pibardex/backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd /Users/germandosaulaces/Desktop/pibardex
npm run dev
```

### Opción 2: Usar el script de inicio automático
```bash
cd /Users/germandosaulaces/Desktop/pibardex/backend
./start.sh
```

## URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Solución de Problemas

### MongoDB no se conecta
1. Verificar que MongoDB está corriendo:
   ```bash
   brew services list | grep mongodb
   ```

2. Si no está corriendo, iniciarlo:
   ```bash
   brew services start mongodb-community
   ```

3. Verificar el puerto:
   ```bash
   lsof -i :27017
   ```

### Alternativa: MongoDB Atlas (Cloud)
Si tienes problemas con la instalación local:

1. Ve a https://www.mongodb.com/atlas
2. Crea una cuenta gratuita
3. Crea un cluster
4. Obtén tu string de conexión
5. Actualiza `MONGODB_URI` en el archivo `.env` del backend

### Puertos ocupados
Si los puertos están ocupados:

- Frontend (5173): Cambiar en `vite.config.ts`
- Backend (5000): Cambiar `PORT` en `.env`

## Estructura del Proyecto

```
pibardex/
├── frontend/           # Aplicación React + TypeScript
├── backend/           # API REST con Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── seeders/
│   └── .env
└── README.md
```

## Comandos Útiles

```bash
# Backend
npm run dev          # Modo desarrollo
npm run seed         # Poblar base de datos
npm test            # Ejecutar tests

# Frontend
npm run dev         # Modo desarrollo
npm run build       # Construir para producción
npm run preview     # Vista previa de producción
```