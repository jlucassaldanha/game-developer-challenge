import React, { useState } from 'react'

interface StartMenuProps {
  onStartGame: (captainName: string) => void
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStartGame }) => {
  const [captainName, setCaptainName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!captainName.trim()) return
    onStartGame(captainName.trim())
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.menuContainer}>
        <div style={styles.header}>
          <img
            src="/assets/png/default/ships/ship_1.png"
            alt="Ship Logo"
            style={styles.logoImage}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h1 style={styles.title}>Batalha Naval dos Piratas</h1>
          <p style={styles.subtitle}>Desafio de Desenvolvimento React & PixiJS</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Nome do Capitão:
            <input
              type="text"
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
              placeholder="Digite o nome do seu capitão..."
              style={styles.input}
              maxLength={20}
              required
            />
          </label>

          <div style={styles.controlsInfo}>
            <h3 style={styles.controlsTitle}>Controles do Navio</h3>
            <div style={styles.controlRow}>
              <span style={styles.key}>WASD / Setas</span>
              <span style={styles.action}>Navegação & Curvas</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>Q</span>
              <span style={styles.action}>Bordada Esquerda (3 Canhões)</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>E</span>
              <span style={styles.action}>Bordada Direita (3 Canhões)</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>ESPAÇO</span>
              <span style={styles.action}>Tiro Frontal</span>
            </div>
          </div>

          <button type="submit" style={styles.startButton} disabled={!captainName.trim()}>
            ZARPAR PARA A BATALHA
          </button>
        </form>
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
  menuContainer: {
    backgroundColor: '#0f172a',
    border: '2px solid #b89756',
    borderRadius: '16px',
    padding: '32px 40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoImage: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    marginBottom: '12px',
  },
  title: {
    color: '#f59e0b',
    fontSize: '26px',
    fontWeight: 'bold',
    margin: '0 0 6px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
  },
  controlsInfo: {
    backgroundColor: '#1e293b',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px solid #334155',
  },
  controlsTitle: {
    color: '#b89756',
    fontSize: '13px',
    textTransform: 'uppercase',
    margin: '0 0 6px 0',
    letterSpacing: '1px',
  },
  controlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  key: {
    backgroundColor: '#334155',
    color: '#38bdf8',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  action: {
    color: '#cbd5e1',
    fontSize: '13px',
  },
  startButton: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}
