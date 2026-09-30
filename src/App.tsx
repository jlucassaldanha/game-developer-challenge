import { useState, useEffect } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { HUD } from './components/HUD'

export function App() {
  const [hp, setHp] = useState(100)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState<{ isOver: boolean; reason?: 'time' | 'death' }>({
    isOver: false,
  })

  useEffect(() => {
    if (isPaused || gameOver.isOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameOver({ isOver: true, reason: 'time' })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, gameOver.isOver])

  const handleGameOver = (finalScore: number, reason: 'time' | 'death') => {
    setScore(finalScore)
    setGameOver({ isOver: true, reason })
  }

  const handleRestart = () => {
    setHp(100)
    setScore(0)
    setTimeLeft(60)
    setIsPaused(false)
    setGameOver({ isOver: false })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!gameOver.isOver && (
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
            />
          </div>
        </>
      )}

      {gameOver.isOver && (
        <div style={styles.gameOverScreen}>
          <h1>{gameOver.reason === 'death' ? 'Seu Navio Foi Afundado!' : 'Tempo Esgotado!'}</h1>
          <p style={styles.finalScore}>Pontuação Final: {score}</p>
          <button style={styles.restartButton} onClick={handleRestart}>
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  gameOverScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 20,
    backgroundColor: 'rgba(10, 25, 47, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
    fontFamily: 'sans-serif',
  },
  finalScore: {
    fontSize: '28px',
    color: '#e9c46a',
    margin: '20px 0',
  },
  restartButton: {
    backgroundColor: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
  },
}

export default App
