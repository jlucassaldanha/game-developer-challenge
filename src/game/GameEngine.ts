import { Application, Container, TilingSprite, Graphics } from 'pixi.js'
import { InputManager } from './systems/InputManager'
import { AssetManager } from './systems/AssetManager'
import { CollisionManager } from './systems/CollisionManager'
import { EnemySpawner } from './systems/EnemySpawner'
import { PlayerShip } from './entities/PlayerShip'
import { Projectile } from './entities/Projectile'
import { Island } from './entities/Island'
import { Enemy } from './entities/Enemy'
import { Explosion } from './entities/Explosion'
import { checkCircleCollision } from './utils/collision'

export interface GameCallbacks {
  onHealthChange: (hp: number) => void
  onScoreChange: (score: number) => void
  onGameOver: (finalScore: number, reason: 'time' | 'death') => void
}

export class GameEngine {
  private app: Application
  private container: Container
  private callbacks: GameCallbacks
  private isPaused = false

  private isInitialized = false
  private isDestroyed = false

  private inputManager: InputManager
  private enemySpawner: EnemySpawner
  private player?: PlayerShip
  private islands: Island[] = []
  private projectiles: Projectile[] = []
  private enemies: Enemy[] = []
  private explosions: Explosion[] = []

  private waterBg?: TilingSprite
  private score = 0

  public readonly LOGICAL_WIDTH = 1280
  public readonly LOGICAL_HEIGHT = 720

  constructor(callbacks: GameCallbacks) {
    this.app = new Application()
    this.container = new Container()
    this.callbacks = callbacks
    this.inputManager = new InputManager()
    this.enemySpawner = new EnemySpawner()
  }

  async init(element: HTMLDivElement) {
    await this.app.init({
      resizeTo: window,
      backgroundColor: 0x1d3557,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    if (this.isDestroyed) {
      this.app.destroy(true, { children: true, texture: true })
      return
    }

    await AssetManager.loadAssets()

    const windowWidth = window.innerWidth || 1280
    const windowHeight = window.innerHeight || 720

    const scale = Math.max(
      0.1,
      Math.min(windowWidth / this.LOGICAL_WIDTH, windowHeight / this.LOGICAL_HEIGHT)
    )

    this.container.scale.set(scale)
    this.container.x = (windowWidth - this.LOGICAL_WIDTH * scale) / 2
    this.container.y = (windowHeight - this.LOGICAL_HEIGHT * scale) / 2

    element.appendChild(this.app.canvas)
    this.app.stage.addChild(this.container)

    const waterTex = AssetManager.getTexture('water')
    if (waterTex) {
      this.waterBg = new TilingSprite({
        texture: waterTex,
        width: this.LOGICAL_WIDTH,
        height: this.LOGICAL_HEIGHT,
      })
      this.container.addChild(this.waterBg)
    } else {
      const oceanGfx = new Graphics()
        .rect(0, 0, this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT)
        .fill(0x1d3557)
      this.container.addChild(oceanGfx)
    }

    const islandTex = AssetManager.getTexture('island')
    const island1 = new Island(this.LOGICAL_WIDTH * 0.3, this.LOGICAL_HEIGHT * 0.35, 130, islandTex)
    const island2 = new Island(this.LOGICAL_WIDTH * 0.7, this.LOGICAL_HEIGHT * 0.65, 130, islandTex)

    this.islands = [island1, island2]
    this.islands.forEach((island) => this.container.addChild(island.container))

    const playerTex = AssetManager.getTexture('player')
    this.player = new PlayerShip(this.LOGICAL_WIDTH / 2, this.LOGICAL_HEIGHT / 2 + 200, playerTex)
    this.container.addChild(this.player.container)

    this.app.ticker.add((ticker) => {
      if (this.isPaused) return
      this.update(ticker.deltaTime)
    })

    this.isInitialized = true
  }

  private update(delta: number) {
    if (!this.player) return
    const bounds = { width: this.LOGICAL_WIDTH, height: this.LOGICAL_HEIGHT }

    if (this.waterBg) {
      this.waterBg.tilePosition.x -= 0.3 * delta
      this.waterBg.tilePosition.y -= 0.2 * delta
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

    CollisionManager.handlePlayerIslandCollisions(this.player, this.islands)

    this.enemySpawner.update(
      delta,
      this.LOGICAL_WIDTH,
      this.LOGICAL_HEIGHT,
      (newEnemy) => {
        this.enemies.push(newEnemy)
        this.container.addChild(newEnemy.container)
      }
    )

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

      if (
        enemy.type === 'chaser' &&
        checkCircleCollision(
          enemy.container.x,
          enemy.container.y,
          enemy.radius,
          this.player.container.x,
          this.player.container.y,
          20
        )
      ) {
        this.player.takeDamage(20)
        this.callbacks.onHealthChange(this.player.hp)
        this.createExplosion(enemy.container.x, enemy.container.y)
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

    CollisionManager.handleEnemyIslandCollisions(this.enemies, this.islands)

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.update(delta, bounds)
    }

    CollisionManager.handleProjectileCollisions(
      this.projectiles,
      this.enemies,
      this.player,
      this.islands,
      (x, y) => this.createExplosion(x, y),
      () => {
        this.score += 1
        this.callbacks.onScoreChange(this.score)
      },
      (damage) => {
        if (!this.player) return
        this.player.takeDamage(damage)
        this.callbacks.onHealthChange(this.player.hp)
        if (this.player.hp <= 0) {
          this.callbacks.onGameOver(this.score, 'death')
        }
      }
    )

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      if (this.projectiles[i].isDead) {
        this.projectiles[i].destroy()
        this.projectiles.splice(i, 1)
      }
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i]
      exp.update(delta)
      if (exp.isDead) {
        exp.destroy()
        this.explosions.splice(i, 1)
      }
    }
  }

  private createExplosion(x: number, y: number) {
    const explosionTex = AssetManager.getTexture('explosion')
    const explosion = new Explosion(x, y, explosionTex)
    this.explosions.push(explosion)
    this.container.addChild(explosion.container)
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused
  }

  public destroy() {
    this.isDestroyed = true
    this.inputManager.destroy()
    if (this.player) this.player.destroy()
    this.islands.forEach((island) => island.destroy())
    this.projectiles.forEach((p) => p.destroy())
    this.enemies.forEach((e) => e.destroy())
    this.explosions.forEach((exp) => exp.destroy())

    this.islands = []
    this.projectiles = []
    this.enemies = []
    this.explosions = []

    if (this.isInitialized) {
      this.app.destroy(true, { children: true, texture: true })
    }
  }
}
