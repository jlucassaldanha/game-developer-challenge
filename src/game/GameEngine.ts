import { Application, Container } from "pixi.js"
import { InputManager } from "./systems/InputManager"
import { PlayerShip } from "./entities/PlayerShip"
import type { Projectile } from "./entities/Projectiles"
import { Island } from "./entities/Island"
import { checkCircleCollision } from "./utils/collision"

export interface GameCallbacks {
  onHealthChange: (hp: number) => void
  onScoreChange: (score: number) => void
  onGameOver: (finalScore: number, reason: 'time' | 'death') => void
}

export class GameEngine {
  private app: Application
  private container: Container
  private callbacks: GameCallbacks
  private isPaused: boolean = false

  private isInitialized = false 
  private isDestroyed = false
  
  private inputManager: InputManager 
  private player?: PlayerShip
  private island?: Island
  private projectiles: Projectile[] = []

  public readonly LOGICAL_WIDTH = 1280
  public readonly LOGICAL_HEIGHT = 720

  constructor(callbacks: GameCallbacks) {
    this.app = new Application()
    this.container = new Container()
    this.callbacks = callbacks
    this.inputManager = new InputManager()
  }

  async init(element: HTMLDivElement) {
    // Tela deve adaptar
    await this.app.init({
      resizeTo: window,
      backgroundColor: 0x1d3557,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })

    if (this.isDestroyed) { 
      this.app.destroy(true, { children: true, texture: true }) 
      return 
    }

    const scale = Math.max(0.1, Math.min(
      window.innerWidth / this.LOGICAL_WIDTH,
      window.innerHeight / this.LOGICAL_HEIGHT
    ))

    this.container.scale.set(scale)

    this.container.x = (window.innerWidth - this.LOGICAL_WIDTH * scale) / 2
    this.container.y = (window.innerHeight - this.LOGICAL_HEIGHT * scale) / 2

    element.appendChild(this.app.canvas)
    this.app.stage.addChild(this.container)

    this.island = new Island(this.LOGICAL_WIDTH / 2, this.LOGICAL_HEIGHT / 2, 70)
    this.container.addChild(this.island.container)

    this.player = new PlayerShip(this.LOGICAL_WIDTH / 2, this.LOGICAL_HEIGHT / 2 + 200)
    this.container.addChild(this.player.container)

    this.app.ticker.add((ticker) => {
      if (this.isPaused) return
      this.update(ticker.deltaTime)
    })
  }

  private update(delta: number) {
    const bounds = { width: this.LOGICAL_WIDTH, height: this.LOGICAL_HEIGHT }

    if (this.player) { 
      this.player.update(delta, this.inputManager, bounds, (newProjectile) => {
        this.projectiles.push(newProjectile)
        this.container.addChild(newProjectile.container)
      }) 

      if (this.island) {
        const playerRadius = 20

        if (checkCircleCollision(
          this.player.container.x, this.player.container.y, playerRadius,
          this.island.container.x, this.island.container.y, this.island.radius
        )) {
          const angle = Math.atan2(
            this.player.container.y - this.island.container.y,
            this.player.container.x - this.island.container.x
          )
          const overlap = (playerRadius + this.island.radius) + 2
          this.player.container.x = this.island.container.x + Math.cos(angle) * overlap
          this.player.container.y = this.island.container.y + Math.sin(angle) * overlap
        }
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.update(delta, bounds)
      
      if (this.island && checkCircleCollision(
        p.container.x, p.container.y, 4,
        this.island.container.x, this.island.container.y, this.island.radius
      )) {
        p.isDead = true
      }

      if (p.isDead) {
        p.destroy()
        this.projectiles.splice(i, 1)
      }
    }
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused
  }

  public destroy() {
    this.isDestroyed = true 
    this.inputManager.destroy()

    if (this.player) this.player.destroy()
    if (this.island) this.island.destroy()

    this.projectiles.forEach(p => p.destroy())
    this.projectiles = []

    if (this.isInitialized) { 
      this.app.destroy(true, { children: true, texture: true }) 
    }
  }
}