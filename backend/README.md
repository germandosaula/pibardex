# Pibardex Backend API

Backend API para el juego de colección de cartas Pibardex, construido con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación JWT**: Registro y login seguro de usuarios
- **Sistema de Monedas**: Gestión de monedas virtuales para compras
- **Colección de Cartas**: Sistema completo de cartas con diferentes rarezas
- **Apertura de Packs**: Mecánica de packs con probabilidades por rareza
- **Sistema de Juegos**: Seguimiento de sesiones de juego y recompensas
- **Estadísticas**: Leaderboards y estadísticas de usuario
- **Experiencia y Niveles**: Sistema de progresión del jugador

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pibardex
   JWT_SECRET=tu_clave_secreta_jwt_muy_segura
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

3. **Iniciar MongoDB:**
   ```bash
   # macOS con Homebrew
   brew services start mongodb-community
   
   # O manualmente
   mongod --config /usr/local/etc/mongod.conf
   ```

4. **Poblar la base de datos con cartas de ejemplo:**
   ```bash
   npm run seed
   ```

5. **Iniciar el servidor:**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil

### Usuarios
- `GET /api/users/stats` - Estadísticas del usuario
- `GET /api/users/leaderboard` - Tabla de clasificación
- `POST /api/users/coins/add` - Añadir monedas
- `POST /api/users/coins/spend` - Gastar monedas

### Cartas
- `GET /api/cards/catalog` - Catálogo de cartas disponibles
- `GET /api/cards/collection` - Colección del usuario
- `POST /api/cards/open-pack` - Abrir pack de cartas
- `PUT /api/cards/:cardId/favorite` - Marcar/desmarcar favorito
- `POST /api/cards/mark-seen` - Marcar cartas como vistas

### Juegos
- `POST /api/games/start` - Iniciar sesión de juego
- `POST /api/games/complete/:sessionId` - Completar sesión
- `GET /api/games/history` - Historial de juegos
- `GET /api/games/stats` - Estadísticas de juegos

### Utilidades
- `GET /api/health` - Estado del servidor

## 🎮 Tipos de Juego

### Memory Game
- **Recompensas**: Monedas y experiencia basadas en dificultad y tiempo
- **Bonus**: Cartas por rendimiento excepcional
- **Dificultades**: Fácil (1x), Medio (1.5x), Difícil (2x)

### Spin Wheel
- **Resultados posibles**:
  - `coins_small`: 25 monedas, 10 XP
  - `coins_medium`: 50 monedas, 20 XP
  - `coins_large`: 100 monedas, 40 XP
  - `card_common`: Carta común + 10 monedas, 15 XP
  - `card_rare`: Carta rara + 20 monedas, 30 XP
  - `experience`: 100 XP
  - `nothing`: 5 monedas, 5 XP

### Pack Opening
- **Tipos de packs**:
  - `starter`: 50 monedas, 3 cartas
  - `booster`: 100 monedas, 5 cartas
  - `premium`: 250 monedas, 8 cartas
  - `special`: 500 monedas, 10 cartas

## 🃏 Sistema de Cartas

### Rarezas y Probabilidades
- **Common**: 60% de probabilidad
- **Rare**: 25% de probabilidad
- **Epic**: 12% de probabilidad
- **Legendary**: 3% de probabilidad

### Categorías
- **Character**: Personajes jugables
- **Item**: Objetos y herramientas
- **Spell**: Hechizos y habilidades
- **Location**: Lugares especiales

## 💰 Sistema de Economía

### Monedas
- **Inicio**: 100 monedas
- **Fuentes**: Juegos, logros, subida de nivel
- **Usos**: Compra de packs, objetos especiales

### Experiencia y Niveles
- **XP por nivel**: 1000 puntos
- **Bonus por nivel**: 50 monedas × nivel actual
- **Fuentes**: Completar juegos, abrir packs, logros

## 🔒 Seguridad

- **Autenticación JWT** con expiración configurable
- **Hashing de contraseñas** con bcrypt (12 rounds)
- **Rate limiting** para prevenir spam
- **Validación de entrada** con express-validator
- **Headers de seguridad** con helmet
- **CORS** configurado para el frontend

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📊 Monitoreo

El servidor incluye:
- **Health check endpoint**: `/api/health`
- **Logging** de errores y operaciones importantes
- **Métricas** de rendimiento en desarrollo

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/pibardex
JWT_SECRET=clave_super_secreta_de_produccion
FRONTEND_URL=https://tu-dominio.com
```

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de la API
2. Verifica que MongoDB esté ejecutándose
3. Comprueba las variables de entorno
4. Revisa los logs del servidor

## 📈 Roadmap

- [ ] Sistema de intercambio de cartas entre usuarios
- [ ] Torneos y eventos especiales
- [ ] Logros y badges
- [ ] Sistema de clanes/guilds
- [ ] Marketplace de cartas
- [ ] Notificaciones push
- [ ] Sistema de chat
- [ ] Modo offline