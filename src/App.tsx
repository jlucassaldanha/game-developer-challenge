import React, { useState, useEffect } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { HUD } from './components/HUD'
import { StartMenu } from './components/StartMenu'
import { GameOverMenu } from './components/GameOverMenu'

export function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [captainName, setCaptainName] = useState('')

  const [hp, setHp] = useState(100)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOverReason, setGameOverReason] = useState<'time' | 'death'>('time')

  // Cronômetro da partida
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameOverReason('time')
          setGameState('gameover')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, isPaused])

  const handleStartGame = (name: string) => {
    setCaptainName(name)
    setHp(100)
    setScore(0)
    setTimeLeft(60)
    setIsPaused(false)
    setGameState('playing')
  }

  const handleGameOver = (finalScore: number, reason: 'time' | 'death') => {
    setScore(finalScore)
    setGameOverReason(reason)
    setGameState('gameover')
  }

  const handleRestart = () => {
    setHp(100)
    setScore(0)
    setTimeLeft(60)
    setIsPaused(false)
    setGameState('playing')
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* MENU INICIAL */}
      {gameState === 'menu' && <StartMenu onStartGame={handleStartGame} />}

      {/* JOGO ATIVO & HUD */}
      {gameState === 'playing' && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <GameCanvas
              onHealthChange={setHp}
              onScoreChange={setScore}
              onGameOver={handleGameOver}
              isPaused={isPaused}
            />
          </div>

          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
            <HUD
              hp={hp}
              maxHp={100}
              score={score}
              timeLeft={timeLeft}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((prev) => !prev)}
              captainName={captainName}
            />
          </div>
        </>
      )}

      {/* TELA DE GAME OVER */}
      {gameState === 'gameover' && (
        <GameOverMenu
          score={score}
          reason={gameOverReason}
          captainName={captainName}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
