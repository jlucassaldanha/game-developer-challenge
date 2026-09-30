export class InputManager {
  private keys: Record<string, boolean> = {}

  constructor() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
    window.addEventListener('keyup', (e) => this.onKeyUp(e))
  }

  private onKeyDown(e: KeyboardEvent) {
    this.keys[e.code] = true
  }

  private onKeyUp(e: KeyboardEvent) {
    this.keys[e.code] = false
  }

  public isKeyDown(code: string): boolean {
    return !!this.keys[code]
  }

  public destroy() {
    window.removeEventListener('keydown', (e) => this.onKeyDown(e))
    window.removeEventListener('keyup', (e) => this.onKeyUp(e))
  }
}