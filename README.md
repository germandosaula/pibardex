# 🎮 Pibardex - Juego de Cartas Coleccionables

Pibardex es una aplicación web de cartas coleccionables inspirada en el universo de Pokémon, desarrollada con React, TypeScript y Node.js. Los usuarios pueden coleccionar cartas, jugar minijuegos y gestionar su progreso.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Sistema de Autenticación**: Registro, login y gestión de perfiles
- **Colección de Cartas**: Catálogo completo con diferentes rarezas
- **Apertura de Paquetes**: Sistema de paquetes con probabilidades por rareza
- **Minijuegos**: Memory Game, Ruleta de la Fortuna
- **Sistema de Economía**: Monedas, experiencia y niveles
- **Leaderboard**: Ranking de jugadores
- **Favoritos**: Marca tus cartas favoritas

### 🎨 Tecnologías
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, JWT
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT con bcrypt
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS, Rate Limiting

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática
```bash
cd /Users/germandosaulaces/Desktop/pibardex
./install.sh
```

### Opción 2: Instalación Manual
```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Instalar MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# 5. Poblar base de datos
npm run seed
```

## 🎮 Ejecutar el Proyecto

### Opción 1: Inicio Automático (Recomendado)
```bash
./start-dev.sh
```

### Opción 2: Servicios Separados
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 📱 URLs de Acceso

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🗂️ Estructura del Proyecto

```
pibardex/
├── 📁 frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── config/         # Configuración de API
│   │   ├── services/       # Servicios de API
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   └── public/             # Recursos estáticos
├── 📁 backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routes/         # Rutas de API
│   │   ├── middleware/     # Middleware personalizado
│   │   ├── config/         # Configuración
│   │   └── seeders/        # Datos de ejemplo
│   └── .env               # Variables de entorno
├── 📄 SETUP.md            # Guía detallada de instalación
├── 📄 install.sh          # Script de instalación automática
└── 📄 start-dev.sh        # Script de inicio de desarrollo
```

## 🎯 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Usuarios
- `GET /api/users/stats` - Estadísticas del usuario
- `GET /api/users/leaderboard` - Tabla de clasificación
- `POST /api/users/coins/add` - Añadir monedas
- `POST /api/users/coins/spend` - Gastar monedas

### Cartas
- `GET /api/cards/catalog` - Catálogo de cartas
- `GET /api/cards/collection` - Colección del usuario
- `POST /api/cards/open-pack` - Abrir paquete
- `PUT /api/cards/:id/favorite` - Marcar como favorita

### Juegos
- `POST /api/games/start` - Iniciar sesión de juego
- `PUT /api/games/complete/:id` - Completar juego
- `GET /api/games/history` - Historial de juegos
- `GET /api/games/stats` - Estadísticas de juegos

## 🎲 Sistema de Juegos

### Memory Game
- Encuentra pares de cartas
- Recompensas basadas en tiempo y movimientos
- Diferentes niveles de dificultad

### Ruleta de la Fortuna
- Gira la ruleta para obtener premios
- Monedas, cartas y experiencia
- Costo de entrada configurable

### Apertura de Paquetes
- Diferentes tipos de paquetes
- Sistema de probabilidades por rareza
- Animaciones de apertura

## 💰 Sistema de Economía

### Monedas
- Ganadas en minijuegos
- Usadas para comprar paquetes
- Recompensas diarias

### Experiencia y Niveles
- XP ganada por actividades
- Subida de nivel automática
- Recompensas por nivel

### Rarezas de Cartas
- **Común**: 60% probabilidad
- **Rara**: 25% probabilidad  
- **Épica**: 12% probabilidad
- **Legendaria**: 3% probabilidad

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar frontend
cd backend && npm run dev # Iniciar backend

# Base de datos
cd backend && npm run seed # Poblar con datos

# Construcción
npm run build           # Construir frontend
npm run preview         # Vista previa

# Testing
cd backend && npm test  # Tests del backend
```

## 🔧 Solución de Problemas

### MongoDB no se conecta
```bash
# Verificar estado
brew services list | grep mongodb

# Iniciar servicio
brew services start mongodb-community

# Verificar puerto
lsof -i :27017
```

### Puertos ocupados
- Frontend (5173): Cambiar en `vite.config.ts`
- Backend (5000): Cambiar `PORT` en `.env`

### Dependencias
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentación Adicional

- **[SETUP.md](SETUP.md)** - Guía detallada de instalación
- **[backend/README.md](backend/README.md)** - Documentación del backend

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🎯 Roadmap

- [ ] Sistema de intercambio de cartas
- [ ] Modo multijugador
- [ ] Torneos y eventos
- [ ] Cartas animadas
- [ ] Sistema de logros
- [ ] Modo offline
- [ ] Aplicación móvil

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación en `SETUP.md`
2. Verifica los logs de la consola
3. Asegúrate de que MongoDB está corriendo
4. Verifica que todas las dependencias están instaladas

---

**¡Disfruta coleccionando cartas en Pibardex! 🎮✨**
