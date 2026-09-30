import { Application, Container, TilingSprite, Texture } from "pixi.js"
import { InputManager } from "./systems/InputManager"
import { AssetManager } from "./systems/AssetManager"
import { PlayerShip } from "./entities/PlayerShip"
import { Projectile } from "./entities/Projectile"
import { Island } from "./entities/Island"
import { Enemy, type EnemyType } from "./entities/Enemy"
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
  private islands: Island[] = []
  private projectiles: Projectile[] = []
  private enemies: Enemy[] = []
  private bgTile?: TilingSprite

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

    await AssetManager.loadAssets()

    const windowWidth = window.innerWidth || 1280
    const windowHeight = window.innerHeight || 720

    const scale = Math.max(0.1, Math.min(
      windowWidth / this.LOGICAL_WIDTH,
      windowHeight / this.LOGICAL_HEIGHT
    ))

    this.container.scale.set(scale)
    this.container.x = (windowWidth - this.LOGICAL_WIDTH * scale) / 2
    this.container.y = (windowHeight - this.LOGICAL_HEIGHT * scale) / 2

    element.appendChild(this.app.canvas)
    this.app.stage.addChild(this.container)

    // Fundo de água (TilingSprite)
    const waterTex = AssetManager.getTexture('water')
    if (waterTex && waterTex instanceof Texture) {
      this.bgTile = new TilingSprite({
        texture: waterTex,
        width: this.LOGICAL_WIDTH,
        height: this.LOGICAL_HEIGHT
      })
      this.container.addChild(this.bgTile)
    }

    // Ilhas
    const islandTex = AssetManager.getTexture('island')
    const island1 = new Island(this.LOGICAL_WIDTH * 0.28, this.LOGICAL_HEIGHT * 0.35, 75, islandTex)
    const island2 = new Island(this.LOGICAL_WIDTH * 0.72, this.LOGICAL_HEIGHT * 0.65, 75, islandTex)
    
    this.islands = [island1, island2]
    this.islands.forEach(island => this.container.addChild(island.container))

    // Navio do Jogador
    const playerTex = AssetManager.getTexture('player')
    this.player = new PlayerShip(this.LOGICAL_WIDTH / 2, this.LOGICAL_HEIGHT / 2 + 180, playerTex)
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

    if (this.bgTile) {
      this.bgTile.tilePosition.x -= 0.3 * delta
      this.bgTile.tilePosition.y -= 0.15 * delta
    }

    const cannonTex = AssetManager.getTexture('cannonball')

    this.player.update(
      delta, 
      this.inputManager, 
      bounds, 
      (newProjectile) => {
        this.projectiles.push(newProjectile)
        this.container.addChild(newProjectile.container)
      },
      cannonTex
    )

    for (const island of this.islands) {
      if (checkCircleCollision(
        this.player.container.x, this.player.container.y, 22,
        island.container.x, island.container.y, island.radius
      )) {
        const angle = Math.atan2(
          this.player.container.y - island.container.y,
          this.player.container.x - island.container.x
        )
        this.player.container.x = island.container.x + Math.cos(angle) * (22 + island.radius + 2)
        this.player.container.y = island.container.y + Math.sin(angle) * (22 + island.radius + 2)
      }
    }

    this.spawnTimer += delta
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0
      this.spawnEnemy()
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      enemy.update(
        delta, 
        { x: this.player.container.x, y: this.player.container.y }, 
        (enemyProjectile) => {
          this.projectiles.push(enemyProjectile)
          this.container.addChild(enemyProjectile.container)
        },
        cannonTex
      )

      for (const island of this.islands) {
        if (checkCircleCollision(
          enemy.container.x, enemy.container.y, enemy.radius,
          island.container.x, island.container.y, island.radius
        )) {
          const angle = Math.atan2(
            enemy.container.y - island.container.y,
            enemy.container.x - island.container.x
          )
          enemy.container.x = island.container.x + Math.cos(angle) * (enemy.radius + island.radius + 2)
          enemy.container.y = island.container.y + Math.sin(angle) * (enemy.radius + island.radius + 2)
        }
      }

      if (enemy.type === 'chaser' && checkCircleCollision(
        enemy.container.x, enemy.container.y, enemy.radius,
        this.player.container.x, this.player.container.y, 22
      )) {
        this.player.takeDamage(20)
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

      for (const island of this.islands) {
        if (checkCircleCollision(
          p.container.x, p.container.y, 4,
          island.container.x, island.container.y, island.radius
        )) {
          p.isDead = true
          break
        }
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
        if (checkCircleCollision(p.container.x, p.container.y, 4, this.player.container.x, this.player.container.y, 22)) {
          p.isDead = true
          this.player.takeDamage(10)
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
    const enemyTex = type === 'chaser' ? AssetManager.getTexture('chaser') : AssetManager.getTexture('shooter')

    const enemy = new Enemy(x, y, type, enemyTex)
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
    this.islands.forEach(island => island.destroy())

    this.projectiles.forEach(p => p.destroy())
    this.enemies.forEach(e => e.destroy())
    this.islands = []
    this.projectiles = []
    this.enemies = []

    if (this.isInitialized) {
      this.app.destroy(true, { children: true, texture: true })
    }
  }
}
