import React, { useEffect, useRef } from 'react'
import { GameEngine } from '../game/GameEngine'

interface GameCanvasProps {
  onHealthChange: (hp: number) => void
  onScoreChange: (score: number) => void
  onGameOver: (score: number, reason: 'time' | 'death') => void
  isPaused: boolean
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onHealthChange,
  onScoreChange,
  onGameOver,
  isPaused,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<GameEngine | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const engine = new GameEngine({
      onHealthChange,
      onScoreChange,
      onGameOver,
    })

    engineRef.current = engine
    engine.init(container).catch((err) => {
      console.error("Falha ao inicializar o Canvas:", err)
    })

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setPaused(isPaused)
    }
  }, [isPaused])

  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', background: '#1d3557' }}
    />
  )
}
