import React from 'react'

interface GameOverMenuProps {
  score: number
  reason: 'time' | 'death'
  captainName: string
  onRestart: () => void
}

export const GameOverMenu: React.FC<GameOverMenuProps> = ({
  score,
  reason,
  captainName,
  onRestart,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <img
          src="/assets/png/default/effects/explosion.png"
          alt="Game Over Icon"
          style={styles.headerIcon}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />

        <h1 style={styles.title}>
          {reason === 'death' ? 'Navio Afundado!' : 'Tempo Esgotado!'}
        </h1>

        <p style={styles.subtitle}>
          {reason === 'death'
            ? `O Capitão ${captainName} foi superado pelas forças inimigas.`
            : `O tempo de batalha do Capitão ${captainName} chegou ao fim.`}
        </p>

        <div style={styles.scoreBox}>
          <span style={styles.scoreLabel}>Navios Inimigos Destruídos</span>
          <span style={styles.scoreNumber}>{score}</span>
        </div>

        <button style={styles.restartButton} onClick={onRestart}>
          JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(10, 25, 47, 0.95)',
    zIndex: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  container: {
    backgroundColor: '#0f172a',
    border: '2px solid #b89756',
    borderRadius: '16px',
    padding: '36px 44px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  headerIcon: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    marginBottom: '16px',
  },
  title: {
    color: '#ef4444',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    margin: '0 0 24px 0',
    lineHeight: '1.4',
  },
  scoreBox: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '16px 24px',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '28px',
  },
  scoreLabel: {
    color: '#cbd5e1',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  scoreNumber: {
    color: '#38bdf8',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  },
}
