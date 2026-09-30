import React from 'react'

interface HUDProps {
  hp: number
  maxHp: number
  score: number
  timeLeft: number
  isPaused: boolean
  onTogglePause: () => void
}

export const HUD: React.FC<HUDProps> = ({
  hp,
  maxHp,
  score,
  timeLeft,
  isPaused,
  onTogglePause,
}) => {
  const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100))

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.topBar}>
        <div style={styles.hpContainer}>
          <span style={styles.label}>HP: {hp}/{maxHp}</span>
          <div style={styles.hpBarBackground}>
            <div
              style={{
                ...styles.hpBarFill,
                width: `${hpPercentage}%`,
                backgroundColor: hpPercentage > 50 ? '#2a9d8f' : hpPercentage > 25 ? '#e9c46a' : '#e63946',
              }}
            />
          </div>
        </div>

        <div style={styles.timerContainer}>
          <span style={styles.label}>Tempo</span>
          <span style={styles.timerText}>{formatTime(timeLeft)}</span>
        </div>

        <div style={styles.scoreContainer}>
          <span style={styles.label}>Pontos</span>
          <span style={styles.scoreText}>{score}</span>
        </div>

        <button style={styles.pauseButton} onClick={onTogglePause}>
          {isPaused ? 'Continuar' : 'Pausar'}
        </button>
      </div>

      {isPaused && (
        <div style={styles.pauseModal}>
          <h2>Jogo Pausado</h2>
          <button style={styles.resumeButton} onClick={onTogglePause}>
            Continuar Partida
          </button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    padding: '16px',
    fontFamily: 'sans-serif',
    userSelect: 'none',
  },
  topBar: {
    pointerEvents: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(10, 25, 47, 0.85)',
    padding: '12px 24px',
    borderRadius: '12px',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  hpContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '180px',
  },
  label: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#a8b2d1',
    fontWeight: 'bold',
  },
  hpBarBackground: {
    width: '100%',
    height: '16px',
    backgroundColor: '#1b2a4a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  hpBarFill: {
    height: '100%',
    transition: 'width 0.2s ease-out, background-color 0.2s ease',
  },
  timerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timerText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e9c46a',
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4cc9f0',
  },
  pauseButton: {
    backgroundColor: '#e63946',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  pauseModal: {
    pointerEvents: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(10, 25, 47, 0.95)',
    padding: '32px 48px',
    borderRadius: '16px',
    textAlign: 'center',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  resumeButton: {
    marginTop: '16px',
    backgroundColor: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
}
