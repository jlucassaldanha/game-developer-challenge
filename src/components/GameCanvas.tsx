import { useEffect, useRef } from "react"
import { GameEngine } from "../game/GameEngine"

interface GameCanvasProps {
  onScoreUpdate: (score: number) => void
  onGameOver: (score: number, reason: 'time' | 'death') => void
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onScoreUpdate, onGameOver }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let engine: GameEngine | null = new GameEngine({
      onHealthChange: (hp) => console.log('HP', hp),
      onScoreChange: onScoreUpdate,
      onGameOver: onGameOver
    })


    engine.init(container)

    return () => {
      engine.destroy()  
    }
  }, [])

  return (
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}/>
  )
}