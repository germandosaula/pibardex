import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Gift, Clock, Sparkles } from 'lucide-react'

interface Prize {
  id: number
  coins: number
  probability: number
  color: string
  textColor: string
  angle: number
}

interface SpinWheelProps {
  onCoinsWon?: (coins: number) => void
}

export default function SpinWheel({ onCoinsWon }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [canSpin, setCanSpin] = useState(true)
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [wonCoins, setWonCoins] = useState(0)

  // Premios de la ruleta con sus probabilidades y ángulos proporcionales
  const prizes: Prize[] = [
    { id: 1, coins: 50, probability: 50, color: 'from-green-400 to-green-600', textColor: 'text-white', angle: 180 }, // 50% = 180°
    { id: 2, coins: 100, probability: 30, color: 'from-blue-400 to-blue-600', textColor: 'text-white', angle: 108 }, // 30% = 108°
    { id: 3, coins: 250, probability: 15, color: 'from-purple-400 to-purple-600', textColor: 'text-white', angle: 54 }, // 15% = 54°
    { id: 4, coins: 500, probability: 5, color: 'from-yellow-400 to-yellow-600', textColor: 'text-black', angle: 18 } // 5% = 18°
  ]

  // Verificar si puede hacer spin (una vez al día) - DESACTIVADO PARA PRUEBAS
  useEffect(() => {
    // Para pruebas: siempre permitir spin
    setCanSpin(true)
  }, [])

  // Actualizar tiempo hasta el próximo spin
  const updateTimeUntilNextSpin = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeLeft = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    setTimeUntilNextSpin(`${hours}h ${minutes}m`)
  }

  // Actualizar el contador cada minuto
  useEffect(() => {
    if (!canSpin) {
      const interval = setInterval(updateTimeUntilNextSpin, 60000)
      return () => clearInterval(interval)
    }
  }, [canSpin])

  // NUEVA LÓGICA BASADA EN MEJORES PRÁCTICAS
  const getPrizeAtAngle = (angle: number): Prize => {
    // Normalizar el ángulo entre 0 y 360
    const normalizedAngle = ((angle % 360) + 360) % 360
    
    console.log(`🔍 Ángulo final de la ruleta: ${normalizedAngle}°`)
    
    // El puntero apunta hacia arriba (0°) pero está rotado 180° visualmente
    // Esto significa que efectivamente apunta hacia abajo (180°)
    // Necesitamos ajustar para que coincida con la posición visual del puntero
    const pointerAngle = 180 // El puntero apunta hacia abajo debido al rotate-180
    
    // Calcular qué segmento está bajo el puntero
    // Los segmentos se dibujan desde 0° en sentido horario
    let currentAngle = 0
    
    for (let i = 0; i < prizes.length; i++) {
      const segmentStart = currentAngle
      const segmentEnd = currentAngle + prizes[i].angle
      
      console.log(`🔍 Segmento ${i} (${prizes[i].coins} PiCoins): ${segmentStart}° - ${segmentEnd}°`)
      
      // Calcular la posición relativa del puntero respecto a la rotación de la ruleta
      // Si la ruleta ha rotado 'normalizedAngle' grados, el puntero efectivamente
      // está apuntando a (pointerAngle - normalizedAngle) en el sistema de la ruleta
      const effectivePointerPosition = (pointerAngle - normalizedAngle + 360) % 360
      
      console.log(`🔍 Posición efectiva del puntero: ${effectivePointerPosition}°`)
      
      // Verificar si el puntero está en este segmento
      if (effectivePointerPosition >= segmentStart && effectivePointerPosition < segmentEnd) {
        console.log(`✅ Premio detectado: ${prizes[i].coins} PiCoins`)
        return prizes[i]
      }
      
      currentAngle = segmentEnd
    }
    
    // Fallback al primer premio
    console.log(`⚠️ Fallback al primer premio: ${prizes[0].coins} PiCoins`)
    return prizes[0]
  }

  const selectTargetAngle = (): number => {
    const random = Math.random() * 100
    let cumulative = 0
    
    // Seleccionar premio basado en probabilidades
    let selectedPrize = prizes[0]
    for (const prize of prizes) {
      cumulative += prize.probability
      if (random <= cumulative) {
        selectedPrize = prize
        break
      }
    }
    
    console.log(`🎯 Premio objetivo: ${selectedPrize.coins} PiCoins`)
    
    // Encontrar el rango de ángulos para este premio
    let segmentStart = 0
    for (let i = 0; i < prizes.length; i++) {
      if (prizes[i].id === selectedPrize.id) {
        break
      }
      segmentStart += prizes[i].angle
    }
    
    const segmentEnd = segmentStart + selectedPrize.angle
    
    // Elegir un punto aleatorio dentro del segmento (preferiblemente en el centro)
    const targetAngleInSegment = segmentStart + (selectedPrize.angle / 2)
    
    console.log(`🎯 Ángulo objetivo en segmento: ${targetAngleInSegment}° (${segmentStart}° - ${segmentEnd}°)`)
    
    // Para que este ángulo esté bajo el puntero (que apunta a 180°),
    // necesitamos rotar la ruleta de manera que:
    // (180 - rotación) % 360 = targetAngleInSegment
    // Por lo tanto: rotación = (180 - targetAngleInSegment + 360) % 360
    const targetRotation = (180 - targetAngleInSegment + 360) % 360
    
    console.log(`🎯 Rotación necesaria: ${targetRotation}°`)
    
    return targetRotation
  }

  // Función para hacer spin
  const handleSpin = () => {
    if (!canSpin || isSpinning) return

    setIsSpinning(true)
    setShowResult(false)

    // Seleccionar el ángulo objetivo basado en probabilidades
    const targetAngle = selectTargetAngle()
    
    // Añadir rotaciones adicionales para el efecto visual (3-5 vueltas completas)
    const extraRotations = (Math.random() * 2 + 3) * 360 // 3-5 vueltas
    const finalRotation = rotation + extraRotations + targetAngle

    console.log(`🎮 Iniciando spin:`)
    console.log(`🎮 Rotación actual: ${rotation}°`)
    console.log(`🎮 Ángulo objetivo: ${targetAngle}°`)
    console.log(`🎮 Rotaciones extra: ${extraRotations}°`)
    console.log(`🎮 Rotación final: ${finalRotation}°`)

    setRotation(finalRotation)

    // Después de la animación, determinar el premio
    setTimeout(() => {
      const finalAngle = finalRotation % 360
      const wonPrize = getPrizeAtAngle(finalAngle)
      
      console.log(`🏆 Resultado final:`)
      console.log(`🏆 Ángulo final: ${finalAngle}°`)
      console.log(`🏆 Premio ganado: ${wonPrize.coins} PiCoins`)
      
      setWonCoins(wonPrize.coins)
      setShowResult(true)
      setIsSpinning(false)
      
      // Callback para actualizar monedas
      if (onCoinsWon) {
        onCoinsWon(wonPrize.coins)
      }

      // Guardar la fecha del último spin (desactivado para pruebas)
      // localStorage.setItem('lastSpinDate', new Date().toDateString())
      // setCanSpin(false)
      // updateTimeUntilNextSpin()
    }, 3000) // Duración de la animación
  }

  const closeResult = () => {
    setShowResult(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Ruleta de la Fortuna
        </h1>
        <p className="text-gray-300">¡Gira la ruleta y gana PiCoins!</p>
      </div>

      {/* Ruleta Container */}
      <div className="relative mb-8">
        {/* Pointer */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 z-20 rotate-90">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <motion.div
          className="relative w-80 h-80 rounded-full border-8 border-yellow-400 shadow-2xl overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ 
            duration: isSpinning ? 3 : 0,
            ease: isSpinning ? "easeOut" : "linear"
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {prizes.map((prize, index) => {
              // Calcular ángulo acumulado hasta este segmento
              let startAngle = 0
              for (let i = 0; i < index; i++) {
                startAngle += prizes[i].angle
              }
              const endAngle = startAngle + prize.angle
              
              // Convertir ángulos a radianes
              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180
              
              // Calcular puntos del arco
              const x1 = 100 + 90 * Math.cos(startRad)
              const y1 = 100 + 90 * Math.sin(startRad)
              const x2 = 100 + 90 * Math.cos(endRad)
              const y2 = 100 + 90 * Math.sin(endRad)
              
              // Determinar si el arco es mayor a 180 grados
              const largeArcFlag = prize.angle > 180 ? 1 : 0
              
              // Crear el path del segmento
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ')
              
              // Calcular posición del texto (centro del segmento)
              const textAngle = (startRad + endRad) / 2
              const textX = 100 + 60 * Math.cos(textAngle)
              const textY = 100 + 60 * Math.sin(textAngle)
              
              return (
                <g key={prize.id}>
                  <defs>
                    <linearGradient id={`gradient-${prize.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={
                        prize.color.includes('green') ? '#4ade80' :
                        prize.color.includes('blue') ? '#60a5fa' :
                        prize.color.includes('purple') ? '#a78bfa' :
                        '#facc15'
                      } />
                      <stop offset="100%" stopColor={
                        prize.color.includes('green') ? '#16a34a' :
                        prize.color.includes('blue') ? '#2563eb' :
                        prize.color.includes('purple') ? '#7c3aed' :
                        '#ca8a04'
                      } />
                    </linearGradient>
                  </defs>
                  <path
                    d={pathData}
                    fill={`url(#gradient-${prize.id})`}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <foreignObject
                    x={textX - 10}
                    y={textY - 18}
                    width="20"
                    height="20"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <Coins className="w-4 h-4 text-white" />
                    </div>
                  </foreignObject>
                  <text
                    x={textX}
                    y={textY + 8}
                    textAnchor="middle"
                    className="font-bold text-sm fill-white"
                    dominantBaseline="middle"
                  >
                    {prize.coins}
                  </text>
                </g>
              )
            })}
          </svg>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Spin Button */}
      <div className="text-center">
        {canSpin ? (
          <motion.button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
              isSpinning 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
            whileHover={!isSpinning ? { scale: 1.05 } : {}}
            whileTap={!isSpinning ? { scale: 0.95 } : {}}
          >
            {isSpinning ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Girando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Gift size={24} />
                ¡GIRAR GRATIS!
              </div>
            )}
          </motion.button>
        ) : (
          <div className="text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <Clock className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-300 mb-2">Próximo spin gratis en:</p>
              <p className="text-xl font-bold text-yellow-400">{timeUntilNextSpin}</p>
            </div>
          </div>
        )}
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-center max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">¡Felicidades!</h2>
              <p className="text-white/90 mb-4">Has ganado:</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Coins className="text-white" size={32} />
                <span className="text-4xl font-bold text-white">{wonCoins}</span>
                <span className="text-xl text-white/90">PiCoins</span>
              </div>
              <button
                onClick={closeResult}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ¡Genial!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}