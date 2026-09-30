import React from 'react'

interface HUDProps {
  hp: number
  maxHp: number
  score: number
  timeLeft: number
  isPaused: boolean
  onTogglePause: () => void
  captainName?: string
}

export const HUD: React.FC<HUDProps> = ({
  hp,
  maxHp,
  score,
  timeLeft,
  isPaused,
  onTogglePause,
  captainName = 'Capitão',
}) => {
  const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100))

  // Define as cores dinâmicas da barra de vida
  const getHpColor = () => {
    if (hpPercentage > 50) return '#2ec4b6' // Verde/Soroa
    if (hpPercentage > 25) return '#ff9f1c' // Laranja
    return '#e71d36' // Vermelho crítico
  }

  // Tratador para fallbacks de imagem caso o caminho exato varie no ambiente local
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string) => {
    const target = e.currentTarget
    if (target.src !== fallbackSrc && !target.dataset.triedFallback) {
      target.dataset.triedFallback = 'true'
      target.src = fallbackSrc
    } else {
      target.style.display = 'none'
    }
  }

  return (
    <div style={styles.hudOverlay}>
      {/* PAINEL SUPERIOR - STATUS E RECURSOS */}
      <div style={styles.topBar}>
        {/* NOME DO CAPITÃO E VIDA */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <img
              src="/assets/png/default/ui/hud/icon_heart.png"
              alt="HP Icon"
              style={styles.icon}
              onError={(e) => handleImgError(e, '/assets/ui/icon_health.png')}
            />
            <span style={styles.captainLabel}>{captainName}</span>
          </div>
          <div style={styles.hpBarBackground}>
            <div
              style={{
                ...styles.hpBarFill,
                width: `${hpPercentage}%`,
                backgroundColor: getHpColor(),
              }}
            />
            <span style={styles.hpText}>
              {hp} / {maxHp}
            </span>
          </div>
        </div>

        {/* CRONÔMETRO */}
        <div style={styles.cardCenter}>
          <img
            src="/assets/png/default/ui/hud/icon_time.png"
            alt="Timer Icon"
            style={styles.iconLarge}
            onError={(e) => handleImgError(e, '/assets/ui/icon_timer.png')}
          />
          <div style={styles.timeValue}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* PONTUAÇÃO / INIMIGOS AFUNDADOS */}
        <div style={styles.card}>
          <div style={styles.cardHeaderRight}>
            <span style={styles.scoreLabel}>Inimigos Afundados</span>
            <img
              src="/assets/png/default/ui/hud/icon_score.png"
              alt="Score Icon"
              style={styles.icon}
              onError={(e) => handleImgError(e, '/assets/png/default/effects/cannonball.png')}
            />
          </div>
          <div style={styles.scoreValue}>{score}</div>
        </div>
      </div>

      {/* CONTROLES / LEGENDA DE DISPAROS DE CANHÃO (RODAPÉ) */}
      <div style={styles.bottomBar}>
        <div style={styles.controlsContainer}>
          {/* BORDADA ESQUERDA */}
          <div style={styles.controlBox}>
            <span style={styles.keyBadge}>Q</span>
            <div style={styles.controlTextGroup}>
              <span style={styles.controlTitle}>Bordada Esquerda</span>
              <span style={styles.controlSub}>3 Canhões</span>
            </div>
          </div>

          {/* TIRO FRONTAL */}
          <div style={styles.controlBoxPrimary}>
            <span style={styles.keyBadgePrimary}>ESPAÇO</span>
            <div style={styles.controlTextGroup}>
              <span style={styles.controlTitle}>Canhão Frontal</span>
              <span style={styles.controlSub}>Disparo Direto</span>
            </div>
          </div>

          {/* BORDADA DIREITA */}
          <div style={styles.controlBox}>
            <span style={styles.keyBadge}>E</span>
            <div style={styles.controlTextGroup}>
              <span style={styles.controlTitle}>Bordada Direita</span>
              <span style={styles.controlSub}>3 Canhões</span>
            </div>
          </div>

          {/* BOTÃO PAUSAR */}
          <button style={styles.pauseButton} onClick={onTogglePause}>
            <img
              src="/assets/png/default/ui/controls/icon_pause.png"
              alt="Pause"
              style={styles.pauseIcon}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            {isPaused ? 'CONTINUAR' : 'PAUSAR'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    border: '2px solid #b89756',
    borderRadius: '10px',
    padding: '12px 18px',
    minWidth: '220px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    pointerEvents: 'auto',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  cardHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    marginBottom: '4px',
  },
  captainLabel: {
    color: '#f1f5f9',
    fontWeight: 'bold',
    fontSize: '15px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  scoreLabel: {
    color: '#94a3b8',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  icon: {
    width: '22px',
    height: '22px',
    objectFit: 'contain',
  },
  iconLarge: {
    width: '28px',
    height: '28px',
    objectFit: 'contain',
    marginBottom: '4px',
  },
  hpBarBackground: {
    position: 'relative',
    width: '100%',
    height: '20px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #475569',
  },
  hpBarFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
  },
  hpText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px #000',
  },
  cardCenter: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    border: '2px solid #b89756',
    borderRadius: '10px',
    padding: '10px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    pointerEvents: 'auto',
  },
  timeValue: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#f59e0b',
    letterSpacing: '2px',
  },
  scoreValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#38bdf8',
    textAlign: 'right',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  controlsContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '2px solid #b89756',
    borderRadius: '12px',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
    pointerEvents: 'auto',
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  controlBoxPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 10px',
    borderLeft: '1px solid #334155',
    borderRight: '1px solid #334155',
  },
  keyBadge: {
    backgroundColor: '#334155',
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #64748b',
    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
  },
  keyBadgePrimary: {
    backgroundColor: '#b89756',
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #f59e0b',
    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
  },
  controlTextGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  controlTitle: {
    color: '#f1f5f9',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  controlSub: {
    color: '#94a3b8',
    fontSize: '10px',
  },
  pauseButton: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s ease',
  },
  pauseIcon: {
    width: '14px',
    height: '14px',
    objectFit: 'contain',
  },
}
