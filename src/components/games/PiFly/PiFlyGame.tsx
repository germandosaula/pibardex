import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../../../contexts/UserContext';
import apiService from '../../../services/apiService';

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  playerY: number;
  playerVelocity: number;
  obstacles: Obstacle[];
  coins: Coin[];
  powerUps: PowerUp[];
  particles: Particle[];
  selectedSkin: string;
  coinsCollected: number;
  xpGained: number;
}

interface Obstacle {
  id: number;
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: 'shield' | 'slowmo' | 'magnet';
  collected: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Skin {
  id: string;
  name: string;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'holo';
  image: string;
  unlocked: boolean;
}

const GAME_CONFIG = {
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 450,
  PLAYER_SIZE: 45, // Tamaño ajustado para el canvas más pequeño
  GRAVITY: 0.15, // Gravedad ultra suave
  JUMP_FORCE: -4.5, // Salto muy controlado
  OBSTACLE_WIDTH: 35, // Obstáculos ajustados
  OBSTACLE_GAP: 180, // Gap ajustado para el canvas más pequeño
  OBSTACLE_SPEED: 1.2, // Velocidad muy lenta
  COIN_SIZE: 12, // Monedas ajustadas
}

const SKINS: Skin[] = [
  { id: 'default', name: 'FlyChar Básico', cost: 0, rarity: 'common', image: '/FlyChar.png', unlocked: true },
  { id: 'hero', name: 'El Héroe', cost: 200, rarity: 'rare', image: '/PycharHero.png', unlocked: false },
  { id: 'golden', name: 'El Dorado', cost: 500, rarity: 'legendary', image: '/PycharGolden.png', unlocked: false },
];

export default function PiFlyGame() {
  const { state: { user }, addCoins, addExperience, spendCoins, refreshUserData } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [bestScore, setBestScore] = useState(0);
  const [showSkinShop, setShowSkinShop] = useState(false);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(user?.unlockedSkins || ['default']);
  const [obstacleImage, setObstacleImage] = useState<HTMLImageElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [characterImages, setCharacterImages] = useState<{[key: string]: HTMLImageElement}>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cargar imagen de obstáculos
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setObstacleImage(img);
    };
    img.onerror = () => {
      console.error('Error loading obstacle image');
      setObstacleImage(null);
    };
    img.src = '/FlyCoins.png';
  }, []);

  // Cargar imagen de fondo
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.onerror = () => {
      console.error('Error loading background image');
      setBackgroundImage(null);
    };
    img.src = '/Pyflyback.png';
  }, []);

  // Cargar imágenes de personajes
  useEffect(() => {
    const loadCharacterImages = async () => {
      const images: {[key: string]: HTMLImageElement} = {};
      
      for (const skin of SKINS) {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            images[skin.id] = img;
            resolve();
          };
          img.onerror = () => {
            console.error(`Error loading character image: ${skin.image}`);
            reject(new Error(`Failed to load ${skin.image}`));
          };
          img.src = skin.image;
        }).catch(() => {
          // Si falla la carga, continuamos sin esa imagen
        });
      }
      
      setCharacterImages(images);
    };

    loadCharacterImages();
  }, []);

  // Verificar si todas las imágenes están cargadas
  useEffect(() => {
    const hasBasicImages = obstacleImage !== null && backgroundImage !== null;
    const hasCharacterImages = Object.keys(characterImages).length > 0;
    
    if (hasBasicImages && hasCharacterImages) {
      setImagesLoaded(true);
    }
  }, [obstacleImage, backgroundImage, characterImages]);

  // Timeout como fallback para iniciar el juego si las imágenes no cargan
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!imagesLoaded) {
        console.warn('Images taking too long to load, starting game anyway');
        setImagesLoaded(true);
      }
    }, 3000); // 3 segundos de timeout

    return () => clearTimeout(timeout);
  }, [imagesLoaded]);

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    playerY: GAME_CONFIG.CANVAS_HEIGHT / 2,
    playerVelocity: 0,
    obstacles: [],
    coins: [],
    powerUps: [],
    particles: [],
    selectedSkin: user?.selectedSkin || 'default',
    coinsCollected: 0,
    xpGained: 0,
  });

  // Inicializar el juego
  const initGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      isGameOver: false,
      score: 0,
      playerY: GAME_CONFIG.CANVAS_HEIGHT / 2,
      playerVelocity: 0,
      obstacles: [],
      coins: [],
      powerUps: [],
      particles: [],
      selectedSkin: gameState.selectedSkin,
      coinsCollected: 0,
      xpGained: 0,
    });
  }, [gameState.selectedSkin]);

  // Calcular multiplicador de bonificación según la skin equipada
  const getSkinBonus = (skinId: string): number => {
    switch (skinId) {
      case 'hero':
        return 1.25; // El Héroe: 1.25x PiCoins
      case 'golden':
        return 1.50; // El Dorado: 1.50x PiCoins
      default:
        return 1.0; // Sin bonificación
    }
  };

  // Aplicar bonificación a las monedas recolectadas
  const applyBonusToCoins = (baseCoins: number, skinId: string): number => {
    const multiplier = getSkinBonus(skinId);
    return Math.floor(baseCoins * multiplier);
  };

  // Generar obstáculo
  const generateObstacle = (x: number): Obstacle => {
    const minHeight = 50;
    const maxHeight = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.OBSTACLE_GAP - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
      id: Date.now() + Math.random(),
      x,
      topHeight,
      bottomHeight: GAME_CONFIG.CANVAS_HEIGHT - topHeight - GAME_CONFIG.OBSTACLE_GAP,
      passed: false,
    };
  };

  // Generar moneda
  const generateCoin = (x: number): Coin => ({
    id: Date.now() + Math.random(),
    x,
    y: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 100) + 50,
    collected: false,
  });

  // Crear partículas de salto
  const createJumpParticles = (x: number, y: number): Particle[] => {
    const particles: Particle[] = [];
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      
      particles.push({
        id: Date.now() + Math.random(),
        x: x + GAME_CONFIG.PLAYER_SIZE / 2,
        y: y + GAME_CONFIG.PLAYER_SIZE,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 1, // Bias hacia abajo
        life: 30,
        maxLife: 30,
        color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`, // Azules y celestes
        size: 2 + Math.random() * 3,
      });
    }
    
    return particles;
  };

  // Actualizar partículas
  const updateParticles = (particles: Particle[]): Particle[] => {
    return particles
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1, // Gravedad en partículas
        life: particle.life - 1,
      }))
      .filter(particle => particle.life > 0);
  };

  // Detectar colisiones
  const checkCollisions = (state: GameState): boolean => {
    const playerX = 100;
    const characterSize = GAME_CONFIG.PLAYER_SIZE;

    // Colisión con bordes
    if (state.playerY < 0 || state.playerY + characterSize > GAME_CONFIG.CANVAS_HEIGHT) {
      return true;
    }

    // Colisión con obstáculos
    for (const obstacle of state.obstacles) {
      if (
        playerX < obstacle.x + GAME_CONFIG.OBSTACLE_WIDTH &&
        playerX + characterSize > obstacle.x &&
        (state.playerY < obstacle.topHeight || 
         state.playerY + characterSize > GAME_CONFIG.CANVAS_HEIGHT - obstacle.bottomHeight)
      ) {
        return true;
      }
    }

    return false;
  };

  // Actualizar juego
  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    setGameState(prevState => {
      const newState = { ...prevState };

      // Actualizar posición del jugador
      newState.playerVelocity += GAME_CONFIG.GRAVITY;
      newState.playerY += newState.playerVelocity;

      // Actualizar partículas
      newState.particles = updateParticles(newState.particles);

      // Actualizar obstáculos
      newState.obstacles = newState.obstacles
        .map(obstacle => ({ ...obstacle, x: obstacle.x - GAME_CONFIG.OBSTACLE_SPEED }))
        .filter(obstacle => obstacle.x > -GAME_CONFIG.OBSTACLE_WIDTH);

      // Generar nuevos obstáculos
      if (newState.obstacles.length === 0 || 
          newState.obstacles[newState.obstacles.length - 1].x < GAME_CONFIG.CANVAS_WIDTH - 500) {
        newState.obstacles.push(generateObstacle(GAME_CONFIG.CANVAS_WIDTH));
        
        // Generar moneda más frecuentemente para mejor experiencia
        if (Math.random() < 0.6) {
          newState.coins.push(generateCoin(GAME_CONFIG.CANVAS_WIDTH + 100));
        }
      }

      // Actualizar monedas
      newState.coins = newState.coins
        .map(coin => ({ ...coin, x: coin.x - GAME_CONFIG.OBSTACLE_SPEED }))
        .filter(coin => coin.x > -GAME_CONFIG.COIN_SIZE);

      // Verificar recolección de monedas
      const playerX = 100;
      const characterSize = GAME_CONFIG.PLAYER_SIZE;
      newState.coins.forEach(coin => {
        if (!coin.collected &&
            coin.x > playerX - GAME_CONFIG.COIN_SIZE &&
            coin.x < playerX + characterSize + GAME_CONFIG.COIN_SIZE &&
            coin.y > newState.playerY - GAME_CONFIG.COIN_SIZE &&
            coin.y < newState.playerY + characterSize + GAME_CONFIG.COIN_SIZE) {
          coin.collected = true;
          const baseCoins = 5;
          const bonusCoins = applyBonusToCoins(baseCoins, newState.selectedSkin);
          newState.coinsCollected += bonusCoins;
        }
      });

      // Actualizar puntuación
      newState.obstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x + GAME_CONFIG.OBSTACLE_WIDTH < playerX) {
          obstacle.passed = true;
          newState.score += 1;
          newState.xpGained += 10;
        }
      });

      // Verificar colisiones
      if (checkCollisions(newState)) {
        newState.isGameOver = true;
        newState.isPlaying = false;
      }

      return newState;
    });
  }, [gameState.isPlaying, gameState.isGameOver]);

  // Saltar
  const jump = useCallback(() => {
    if (gameState.isGameOver) {
      initGame();
      return;
    }

    if (!gameState.isPlaying) {
      setGameState(prev => ({ ...prev, isPlaying: true }));
    }

    setGameState(prev => {
      const newParticles = createJumpParticles(100, prev.playerY);
      return {
        ...prev,
        playerVelocity: GAME_CONFIG.JUMP_FORCE,
        particles: [...prev.particles, ...newParticles]
      };
    });
  }, [gameState.isGameOver, gameState.isPlaying, initGame]);

  // Renderizar personaje usando imagen con animaciones
  const renderPlayerCard = (ctx: CanvasRenderingContext2D, x: number, y: number, skinId: string) => {
    const characterImage = characterImages[skinId];
    const characterSize = GAME_CONFIG.PLAYER_SIZE;
    const time = Date.now() * 0.005; // Tiempo para animaciones
    
    // Guardar el contexto para las transformaciones
    ctx.save();
    
    // Calcular el centro del personaje
    const centerX = x + characterSize / 2;
    const centerY = y + characterSize / 2;
    
    // Mover el origen al centro del personaje
    ctx.translate(centerX, centerY);
    
    // Animación de flotación suave (movimiento vertical)
    const floatOffset = Math.sin(time * 2) * 4;
    ctx.translate(0, floatOffset);
    
    // Rotación natural hacia la derecha (dirección del vuelo)
    const naturalTilt = Math.PI * 0.05; // Ligera inclinación hacia la derecha (unos 9 grados)
    const floatTilt = Math.sin(time * 1.5) * 0.08; // Oscilación muy sutil
    const totalRotation = naturalTilt + floatTilt;
    ctx.rotate(totalRotation);
    
    // Efecto de "aleteo" - escala horizontal que simula movimiento de alas
    const wingFlap = 1 + Math.sin(time * 8) * 0.1;
    const verticalBob = 1 + Math.sin(time * 6) * 0.05;
    ctx.scale(wingFlap, verticalBob);
    
    // Efecto de brillo/aura alrededor del personaje con pulsación
    const glowIntensity = 0.2 + Math.sin(time * 4) * 0.1;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, characterSize * 0.9);
    glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
    glowGradient.addColorStop(0.6, `rgba(59, 130, 246, ${glowIntensity * 0.3})`);
    glowGradient.addColorStop(1, `rgba(59, 130, 246, ${glowIntensity})`);
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, characterSize * 0.9, 0, Math.PI * 2);
    ctx.fill();
    
    // Efecto de estela de vuelo (partículas de aire detrás del personaje)
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const trailX = -characterSize * 0.8 - i * 15;
      const trailY = Math.sin(time * 3 + i) * 8;
      const trailAlpha = 0.3 - i * 0.1;
      const trailSize = (3 - i) * 2;
      
      ctx.fillStyle = `rgba(135, 206, 250, ${trailAlpha})`;
      ctx.beginPath();
      ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    
    if (characterImage) {
      // Calcular dimensiones manteniendo aspect ratio
      const imgWidth = characterImage.naturalWidth || characterImage.width;
      const imgHeight = characterImage.naturalHeight || characterImage.height;
      const aspectRatio = imgWidth / imgHeight;
      
      let renderWidth = characterSize;
      let renderHeight = characterSize;
      
      // Ajustar dimensiones para mantener aspect ratio
      if (aspectRatio > 1) {
        // Imagen más ancha que alta
        renderHeight = characterSize / aspectRatio;
      } else {
        // Imagen más alta que ancha
        renderWidth = characterSize * aspectRatio;
      }
      
      // Renderizar la imagen del personaje centrada con aspect ratio correcto
      ctx.drawImage(
        characterImage,
        -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight
      );
    } else {
      // Fallback animado: dibujar un círculo simple si la imagen no está disponible
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, characterSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Borde animado
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2 + Math.sin(time * 4) * 0.5;
      ctx.stroke();
      
      // Ojos animados (parpadeo)
      const eyeSize = Math.sin(time * 8) > 0.9 ? 1 : 2;
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(-characterSize*0.15, -characterSize*0.1, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(characterSize*0.15, -characterSize*0.1, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Sonrisa animada
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, characterSize*0.1, characterSize*0.2, 0, Math.PI);
      ctx.stroke();
    }
    
    // Restaurar el contexto
    ctx.restore();
  };

  // Renderizar juego
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mostrar pantalla de carga si las imágenes no están listas
    if (!imagesLoaded) {
      // Fondo de carga
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      // Texto de carga
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Cargando...', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 - 20);
      
      ctx.font = '16px Arial';
      ctx.fillText('🎮 Preparando PiFly', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 10);
      
      // Spinner simple
      const time = Date.now() * 0.01;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 50, 20, time, time + Math.PI);
      ctx.stroke();
      
      return;
    }

    // Fondo usando imagen o gradiente como fallback
    if (backgroundImage) {
      ctx.drawImage(
        backgroundImage,
        0, 0, backgroundImage.width, backgroundImage.height,
        0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT
      );
    } else {
      // Fallback: fondo degradado si la imagen no está cargada
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.3, '#1e293b');
      gradient.addColorStop(0.7, '#334155');
      gradient.addColorStop(1, '#475569');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    }

    // Nubes de fondo sutiles (solo si no hay imagen de fondo)
    if (!backgroundImage) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 5; i++) {
        const cloudX = (Date.now() * 0.02 + i * 150) % (GAME_CONFIG.CANVAS_WIDTH + 100) - 50;
        const cloudY = 50 + i * 30;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
        ctx.arc(cloudX + 15, cloudY, 25, 0, Math.PI * 2);
        ctx.arc(cloudX + 30, cloudY, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Renderizar obstáculos usando la imagen FlyCoins
    gameState.obstacles.forEach(obstacle => {
      if (obstacleImage) {
        // Calcular el tamaño de la imagen para que se ajuste al ancho del obstáculo
        const imageWidth = GAME_CONFIG.OBSTACLE_WIDTH;
        const aspectRatio = obstacleImage.height / obstacleImage.width;
        const imageHeight = imageWidth * aspectRatio;
        
        // Obstáculo superior - repetir la imagen verticalmente
        const topImages = Math.ceil(obstacle.topHeight / imageHeight);
        for (let i = 0; i < topImages; i++) {
          const y = i * imageHeight;
          const remainingHeight = Math.min(imageHeight, obstacle.topHeight - y);
          if (remainingHeight > 0) {
            ctx.drawImage(
              obstacleImage,
              0, 0, obstacleImage.width, (remainingHeight / imageHeight) * obstacleImage.height,
              obstacle.x, y, imageWidth, remainingHeight
            );
          }
        }
        
        // Obstáculo inferior - repetir la imagen verticalmente
        const bottomImages = Math.ceil(obstacle.bottomHeight / imageHeight);
        const bottomStartY = GAME_CONFIG.CANVAS_HEIGHT - obstacle.bottomHeight;
        for (let i = 0; i < bottomImages; i++) {
          const y = bottomStartY + i * imageHeight;
          const remainingHeight = Math.min(imageHeight, obstacle.bottomHeight - i * imageHeight);
          if (remainingHeight > 0) {
            ctx.drawImage(
              obstacleImage,
              0, 0, obstacleImage.width, (remainingHeight / imageHeight) * obstacleImage.height,
              obstacle.x, y, imageWidth, remainingHeight
            );
          }
        }
      } else {
        // Fallback: usar rectángulos si la imagen no está cargada
        const obstacleGradient = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + GAME_CONFIG.OBSTACLE_WIDTH, 0);
        obstacleGradient.addColorStop(0, '#374151');
        obstacleGradient.addColorStop(0.5, '#4b5563');
        obstacleGradient.addColorStop(1, '#374151');
        ctx.fillStyle = obstacleGradient;
        
        // Obstáculo superior
        ctx.fillRect(obstacle.x, 0, GAME_CONFIG.OBSTACLE_WIDTH, obstacle.topHeight);
        // Obstáculo inferior
        ctx.fillRect(
          obstacle.x, 
          GAME_CONFIG.CANVAS_HEIGHT - obstacle.bottomHeight, 
          GAME_CONFIG.OBSTACLE_WIDTH, 
          obstacle.bottomHeight
        );
        
        // Bordes de los obstáculos
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, 0, GAME_CONFIG.OBSTACLE_WIDTH, obstacle.topHeight);
        ctx.strokeRect(
          obstacle.x, 
          GAME_CONFIG.CANVAS_HEIGHT - obstacle.bottomHeight, 
          GAME_CONFIG.OBSTACLE_WIDTH, 
          obstacle.bottomHeight
        );
      }
    });

    // Renderizar monedas mejoradas
    gameState.coins.forEach(coin => {
      if (!coin.collected) {
        // Efecto de brillo
        const glowGradient = ctx.createRadialGradient(coin.x, coin.y, 0, coin.x, coin.y, GAME_CONFIG.COIN_SIZE);
        glowGradient.addColorStop(0, '#fbbf24');
        glowGradient.addColorStop(0.7, '#f59e0b');
        glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, GAME_CONFIG.COIN_SIZE, 0, Math.PI * 2);
        ctx.fill();
        
        // Moneda principal
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, GAME_CONFIG.COIN_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde de la moneda
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Símbolo de moneda
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('₽', coin.x, coin.y + 4);
      }
    });

    // Renderizar jugador como carta
    const playerX = 100;
    renderPlayerCard(ctx, playerX, gameState.playerY, gameState.selectedSkin);

    // Renderizar partículas
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Efecto de brillo en las partículas
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size * 2;
      ctx.fill();
      ctx.restore();
    });

    // Renderizar Game Over (solo oscurecer el canvas)
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    }
  }, [gameState, imagesLoaded, backgroundImage, obstacleImage]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      render();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [updateGame, render]);

  // Event listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Guardar puntuación al finalizar
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > 0) {
      saveGameResults();
    }
  }, [gameState.isGameOver]);

  const saveGameResults = async () => {
    try {
      // Actualizar mejor puntuación
      if (gameState.score > bestScore) {
        setBestScore(gameState.score);
      }

      // Añadir recompensas
      if (gameState.coinsCollected > 0) {
        await addCoins(gameState.coinsCollected);
      }
      
      if (gameState.xpGained > 0) {
        await addExperience(gameState.xpGained);
      }
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  };

  const buySkin = async (skinId: string, cost: number) => {
    if (!user || user.coins < cost) return;

    try {
      const response = await apiService.buySkin(skinId, cost) as any;
      if (response.success) {
        setUnlockedSkins(response.data.unlockedSkins);
        // Refrescar datos del usuario para asegurar sincronización
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error buying skin:', error);
    }
  };

  const selectSkin = async (skinId: string) => {
    if (!unlockedSkins.includes(skinId)) return;

    try {
      const response = await apiService.selectSkin(skinId) as any;
      if (response.success) {
        setGameState(prev => ({ ...prev, selectedSkin: skinId }));
        // Refrescar datos del usuario para asegurar sincronización
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error selecting skin:', error);
    }
  };

  return (
    <div className="pifly-container flex flex-col items-center p-6">
      <h1 className="pokemon-font text-5xl text-white mb-8 text-center drop-shadow-lg">
        🎮 PiFly Adventure
      </h1>
      
      {/* Contenedor del monitor con la imagen ComputerHead.png */}
      <div className="relative flex flex-col items-center">
        {/* Canvas del juego posicionado detrás del marco */}
        <canvas
          ref={canvasRef}
          width={600}
          height={450}
          onClick={jump}
          className="absolute cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            // Posicionamiento para que quede dentro de la pantalla del monitor
            top: '230px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            zIndex: 5
          }}
        />
        
        {/* Imagen del monitor como fondo */}
        <div 
          className="relative"
          style={{
            backgroundImage: 'url(/ComputerHead.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '1200px',
            height: '900px',
            zIndex: 10
          }}
        >
        </div>
        
        {/* Panel de estadísticas mejorado - centrado arriba */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-sm rounded-xl px-6 py-4 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div className="text-center">
                  <div className="text-xs text-purple-300 uppercase tracking-wide">Mejor</div>
                  <div className="text-lg font-bold text-yellow-300">{bestScore}</div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-purple-500/50"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div className="text-center">
                  <div className="text-xs text-purple-300 uppercase tracking-wide">PiCoins</div>
                  <div className="text-lg font-bold text-yellow-300">{user?.coins || 0}</div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-purple-500/50"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <div className="text-center">
                  <div className="text-xs text-purple-300 uppercase tracking-wide">Skin</div>
                  <div className="text-sm font-bold text-green-300">
                    {SKINS.find(s => s.id === gameState.selectedSkin)?.name || 'Básico'}
                  </div>
                </div>
              </div>
              
              {(gameState.selectedSkin === 'hero' || gameState.selectedSkin === 'golden') && (
                <>
                  <div className="w-px h-8 bg-purple-500/50"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div className="text-center">
                      <div className="text-xs text-purple-300 uppercase tracking-wide">Bonus</div>
                      <div className="text-sm font-bold text-orange-300">
                        +{gameState.selectedSkin === 'hero' ? '25' : '50'}%
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center items-center gap-6">
          <button
            onClick={() => setShowSkinShop(true)}
            className="pokemon-button purple px-6 py-3 text-lg"
          >
            🎨 Tienda de Skins
          </button>
          <button
            onClick={initGame}
            className="pokemon-button green px-6 py-3 text-lg"
          >
            🔄 Nueva Partida
          </button>
        </div>
      </div>

      <div className="instruction-text mt-6 text-center pokemon-text text-white max-w-2xl">
        <div className="text-lg mb-2">🎯 ¡Cómo Jugar!</div>
        <p className="mb-2">Presiona <span className="bg-white text-gray-800 px-2 py-1 rounded font-bold">ESPACIO</span> o <span className="bg-white text-gray-800 px-2 py-1 rounded font-bold">CLIC</span> para saltar</p>
        <p className="mb-3">Evita los obstáculos y recolecta todas las PiCoins que puedas</p>
        <div className="text-sm text-green-300 space-y-1">
          <p>🌟 Caída ultra lenta • Espacios gigantes • Velocidad reducida</p>
          <p>🎯 Perfecto para relajarse y coleccionar cartas</p>
        </div>
      </div>

      {/* Game Over Modal - Solo recuadro centrado */}
        {gameState.isGameOver && (
          <div 
            className="absolute z-20"
            style={{
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'auto',
              height: 'auto'
            }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 w-80 border-2 border-gray-600 shadow-2xl">
              <div className="text-center space-y-3">
                {/* Título compacto */}
                <div className="relative">
                  <h2 className="pokemon-font text-2xl text-red-400 animate-pulse">
                    💀 ¡Game Over!
                  </h2>
                  <div className="absolute -top-1 -right-1 text-lg animate-bounce">💥</div>
                </div>
                
                {/* Estadísticas compactas */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-300">📊 Puntuación</span>
                    <span className="font-bold text-yellow-300">{gameState.score}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-300">💰 PiCoins</span>
                    <span className="font-bold text-green-300">{gameState.coinsCollected}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-300">⭐ XP</span>
                    <span className="font-bold text-blue-300">{gameState.xpGained}</span>
                  </div>
                  
                  {/* Nuevo récord compacto */}
                  {gameState.score > bestScore && (
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded p-1 animate-pulse">
                      <div className="text-center text-white font-bold text-xs">
                        🏆 ¡NUEVO RÉCORD!
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Botones compactos */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      initGame();
                      setTimeout(() => {
                        jump();
                      }, 100);
                    }}
                    className="pokemon-button green w-full py-2 text-sm font-bold"
                  >
                    🎮 Jugar de Nuevo
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSkinShop(true)}
                      className="pokemon-button purple flex-1 py-1 text-xs"
                    >
                      🎨 Tienda
                    </button>
                    <button
                      onClick={initGame}
                      className="pokemon-button blue flex-1 py-1 text-xs"
                    >
                      🔄 Reiniciar
                    </button>
                  </div>
                </div>
                
                {/* Mensaje motivacional compacto */}
                <div className="text-center text-gray-300 text-xs">
                  {gameState.score === 0 ? (
                    "¡No te rindas! 💪"
                  ) : gameState.score < 5 ? (
                    "¡Sigue practicando! 🌟"
                  ) : gameState.score < 10 ? (
                    "¡Excelente progreso! 🚀"
                  ) : (
                    "¡Eres un maestro! 👑"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      
      {/* Skin Shop Modal */}
      {showSkinShop && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="pokemon-font text-3xl text-white">🎨 Tienda de Skins</h2>
              <button
                onClick={() => setShowSkinShop(false)}
                className="pokemon-button red px-4 py-2"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKINS.map(skin => {
                const isOwned = unlockedSkins.includes(skin.id);
                const isSelected = gameState.selectedSkin === skin.id;
                const canAfford = (user?.coins || 0) >= skin.cost;
                
                return (
                  <div
                    key={skin.id}
                    className={`skin-card ${isSelected ? 'selected' : ''} ${skin.rarity}`}
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        {/* Efectos de fondo basados en rareza */}
                        {skin.rarity === 'legendary' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 animate-pulse" />
                        )}
                        {skin.rarity === 'epic' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
                        )}
                        {skin.rarity === 'rare' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-500/20" />
                        )}
                        
                        {/* Partículas flotantes para skins especiales */}
                        {skin.rarity !== 'common' && (
                          <div className="absolute inset-0">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                                style={{
                                  left: `${20 + (i * 10)}%`,
                                  top: `${30 + (i % 3) * 20}%`,
                                  animation: `float ${2 + (i % 3)}s ease-in-out infinite`,
                                  animationDelay: `${i * 0.2}s`
                                }}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Previsualización del personaje */}
                        {characterImages[skin.id] ? (
                          <img
                            src={skin.image}
                            alt={skin.name}
                            className="w-20 h-20 object-contain relative z-10"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-blue-500 rounded-full relative z-10 flex items-center justify-center text-2xl">
                            🐦
                          </div>
                        )}
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20">
                            ✓ EQUIPADO
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="pokemon-text text-white text-lg font-bold mb-2">{skin.name}</h3>
                        
                        {/* Estrellas de rareza */}
                        <div className="flex justify-center mb-3">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span 
                              key={i} 
                              className={`text-lg ${
                                i < (skin.rarity === 'common' ? 1 : 
                                     skin.rarity === 'rare' ? 2 : 
                                     skin.rarity === 'epic' ? 3 : 
                                     skin.rarity === 'legendary' ? 4 : 5) 
                                  ? 'text-yellow-400' : 'text-gray-500'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        
                        {/* Información de bonificación */}
                        {(skin.id === 'hero' || skin.id === 'golden') && (
                          <div className="rarity-badge legendary mb-3 pokemon-text text-sm">
                            💰 +{skin.id === 'hero' ? '25' : '50'}% PiCoins
                          </div>
                        )}
                        
                        {/* Botón de acción */}
                        {isOwned ? (
                          <button
                            onClick={() => selectSkin(skin.id)}
                            className={`pokemon-button ${isSelected ? 'green' : 'blue'} w-full py-2`}
                            disabled={isSelected}
                          >
                            {isSelected ? '✓ Equipado' : '🎯 Equipar'}
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="pokemon-text text-yellow-300 font-bold">
                              💰 {skin.cost} PiCoins
                            </div>
                            <button
                              onClick={() => buySkin(skin.id, skin.cost)}
                              className={`pokemon-button ${canAfford ? 'yellow' : 'gray'} w-full py-2`}
                              disabled={!canAfford}
                            >
                              {canAfford ? '🛒 Comprar' : '💸 Sin fondos'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}