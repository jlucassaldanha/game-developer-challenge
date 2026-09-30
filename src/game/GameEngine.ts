import { Application, Container } from "pixi.js"
import { InputManager } from "./systems/InputManager"
import { PlayerShip } from "./entities/PlayerShip"
import type { Projectile } from "./entities/Projectile"
import { Island } from "./entities/Island"
import { checkCircleCollision } from "./utils/collision"
import { Enemy, type EnemyType } from "./entities/Enemy"

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
  private enemies: Enemy[] = []

  private score = 0
  private spawnTimer = 0
  private spawnInterval = 180

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

    this.isInitialized = true
  }

  private update(delta: number) {
    const bounds = { width: this.LOGICAL_WIDTH, height: this.LOGICAL_HEIGHT }

    if (!this.player) return

    this.player.update(delta, this.inputManager, bounds, (newProjectile) => {
      this.projectiles.push(newProjectile)
      this.container.addChild(newProjectile.container)
    })

    if (this.island) {
      if (checkCircleCollision(
        this.player.container.x, this.player.container.y, 20,
        this.island.container.x, this.island.container.y, this.island.radius
      )) {
        const angle = Math.atan2(
          this.player.container.y - this.island.container.y,
          this.player.container.x - this.island.container.x
        )
        this.player.container.x = this.island.container.x + Math.cos(angle) * (20 + this.island.radius + 2)
        this.player.container.y = this.island.container.y + Math.sin(angle) * (20 + this.island.radius + 2)
      }
    }

    this.spawnTimer += delta
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0
      this.spawnEnemy()
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      enemy.update(delta, { x: this.player.container.x, y: this.player.container.y }, (enemyProjectile) => {
        this.projectiles.push(enemyProjectile)
        this.container.addChild(enemyProjectile.container)
      })

      if (this.island && checkCircleCollision(
        enemy.container.x, enemy.container.y, enemy.radius,
        this.island.container.x, this.island.container.y, this.island.radius
      )) {
        const angle = Math.atan2(
          enemy.container.y - this.island.container.y,
          enemy.container.x - this.island.container.x
        )
        enemy.container.x = this.island.container.x + Math.cos(angle) * (enemy.radius + this.island.radius + 2)
        enemy.container.y = this.island.container.y + Math.sin(angle) * (enemy.radius + this.island.radius + 2)
      }

      if (enemy.type === 'chaser' && checkCircleCollision(
        enemy.container.x, enemy.container.y, enemy.radius,
        this.player.container.x, this.player.container.y, 20
      )) {
        this.player.hp -= 20
        this.callbacks.onHealthChange(this.player.hp)
        enemy.isDead = true

        if (this.player.hp <= 0) {
          this.callbacks.onGameOver(this.score, 'death')
        }
      }

      if (enemy.isDead) {
        enemy.destroy()
        this.enemies.splice(i, 1)
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

      if (!p.isEnemy) {
        for (const enemy of this.enemies) {
          if (!enemy.isDead && checkCircleCollision(p.container.x, p.container.y, 4, enemy.container.x, enemy.container.y, enemy.radius)) {
            p.isDead = true
            enemy.takeDamage(20)

            if (enemy.isDead) {
              this.score += 1
              this.callbacks.onScoreChange(this.score)
            }
            break
          }
        }
      } else {
        if (checkCircleCollision(p.container.x, p.container.y, 4, this.player.container.x, this.player.container.y, 20)) {
          p.isDead = true
          this.player.hp -= 10
          this.callbacks.onHealthChange(this.player.hp)

          if (this.player.hp <= 0) {
            this.callbacks.onGameOver(this.score, 'death')
          }
        }
      }

      if (p.isDead) {
        p.destroy()
        this.projectiles.splice(i, 1)
      }
    }
  }

  private spawnEnemy() {
    const side = Math.floor(Math.random() * 4)
    let x = 0, y = 0

    if (side === 0) { x = Math.random() * this.LOGICAL_WIDTH; y = 20 }
    else if (side === 1) { x = this.LOGICAL_WIDTH - 20; y = Math.random() * this.LOGICAL_HEIGHT }
    else if (side === 2) { x = Math.random() * this.LOGICAL_WIDTH; y = this.LOGICAL_HEIGHT - 20 }
    else { x = 20; y = Math.random() * this.LOGICAL_HEIGHT }

    const type: EnemyType = Math.random() > 0.4 ? 'chaser' : 'shooter'
    const enemy = new Enemy(x, y, type)
    this.enemies.push(enemy)
    this.container.addChild(enemy.container)
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