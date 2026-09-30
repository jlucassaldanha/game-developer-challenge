import { useState } from "react";
import { GameCanvas } from "./components/GameCanvas";

export function App() {
  // Tanstack?
  const [score, setScore] = useState(0)

  const handleGameOver = (finalScore: number, reason: 'time' | 'death') => {
    console.log(`Game Over! Score: ${finalScore}, Reason: ${reason}`)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }} >
      <GameCanvas 
        onScoreUpdate={(newScore) => setScore(newScore)}
        onGameOver={handleGameOver}
      />
    </div>
  )
}

export default App