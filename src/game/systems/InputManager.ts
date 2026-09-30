export class InputManager {
  private keysState: Record<string, boolean> = {}

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keysState[e.code] = true
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keysState[e.code] = false
  }

  public isKeyDown(code: string): boolean {
    return !!this.keysState[code]
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    this.keysState = {}
  }
}
