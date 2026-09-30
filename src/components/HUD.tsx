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
        {/* HP Bar */}
        <div style={styles.hpContainer}>
          <div style={styles.labelRow}>
            <span style={styles.icon}>⚓</span>
            <span style={styles.label}>Casco: {hp}/{maxHp}</span>
          </div>
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

        {/* Cronômetro */}
        <div style={styles.statBox}>
          <span style={styles.icon}>⌛</span>
          <div style={styles.statTextGroup}>
            <span style={styles.label}>Tempo</span>
            <span style={styles.timerText}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Pontuação */}
        <div style={styles.statBox}>
          <span style={styles.icon}>☠️</span>
          <div style={styles.statTextGroup}>
            <span style={styles.label}>Pontos</span>
            <span style={styles.scoreText}>{score}</span>
          </div>
        </div>

        {/* Botão de Pausa */}
        <button style={styles.pauseButton} onClick={onTogglePause}>
          {isPaused ? '▶ Continuar' : '❚❚ Pausar'}
        </button>
      </div>

      {isPaused && (
        <div style={styles.pauseModal}>
          <h2 style={styles.modalTitle}>🏴‍☠️ Jogo Pausado</h2>
          <p style={styles.modalText}>Descanse as velas, capitão!</p>
          <button style={styles.resumeButton} onClick={onTogglePause}>
            Voltar à Batalha
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
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
    userSelect: 'none',
  },
  topBar: {
    pointerEvents: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(180deg, rgba(35, 23, 13, 0.92) 0%, rgba(18, 12, 7, 0.95) 100%)',
    border: '3px solid #c9a050',
    borderRadius: '12px',
    padding: '12px 24px',
    color: '#f4e8c1',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(201, 160, 80, 0.2)',
  },
  hpContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '200px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  icon: {
    fontSize: '20px',
  },
  label: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#d4af37',
    fontWeight: 'bold',
  },
  hpBarBackground: {
    width: '100%',
    height: '18px',
    backgroundColor: '#120c06',
    borderRadius: '9px',
    overflow: 'hidden',
    border: '2px solid #8b5a2b',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
  },
  hpBarFill: {
    height: '100%',
    transition: 'width 0.2s ease-out, background-color 0.2s ease',
    borderRadius: '6px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '6px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(201, 160, 80, 0.4)',
  },
  statTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timerText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#e9c46a',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
  },
  scoreText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#4cc9f0',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
  },
  pauseButton: {
    background: 'linear-gradient(180deg, #d4a359 0%, #8b5a2b 100%)',
    color: '#2b1808',
    border: '2px solid #f4e8c1',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
  },
  pauseModal: {
    pointerEvents: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(180deg, rgba(35, 23, 13, 0.96) 0%, rgba(18, 12, 7, 0.98) 100%)',
    border: '4px solid #c9a050',
    padding: '36px 52px',
    borderRadius: '16px',
    textAlign: 'center',
    color: '#f4e8c1',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(201, 160, 80, 0.3)',
  },
  modalTitle: {
    fontSize: '28px',
    color: '#e9c46a',
    marginBottom: '8px',
  },
  modalText: {
    fontSize: '16px',
    color: '#c4b272',
    marginBottom: '20px',
  },
  resumeButton: {
    backgroundColor: '#2a9d8f',
    color: '#ffffff',
    border: '2px solid #ffffff',
    padding: '12px 28px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
}
