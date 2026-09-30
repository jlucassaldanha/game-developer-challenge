import { Container, Graphics } from 'pixi.js'
import { Projectile } from './Projectile'

export type EnemyType = 'chaser' | 'shooter'

export class Enemy {
  public container: Container
  private sprite: Graphics
  public type: EnemyType

  public hp: number
  public maxHp: number
  public isDead = false
  public radius = 18

  private speed: number
  private shootCooldown = 0

  constructor(x: number, y: number, type: EnemyType = 'chaser') {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.type = type

    if (type === 'chaser') {
      this.hp = 30
      this.maxHp = 30
      this.speed = 2.2
    } else {
      this.hp = 50
      this.maxHp = 50
      this.speed = 1.4
    }

    this.sprite = new Graphics()
      .rect(-15, -10, 30, 20)
      .fill(type === 'chaser' ? 0xf4a261 : 0x9d4edd)
      .stroke({ width: 2, color: 0xffffff })

    this.container.addChild(this.sprite)
  }

  public update(
    delta: number,
    playerPos: { x: number; y: number },
    onEnemyShoot: (p: Projectile) => void
  ) {
    if (this.isDead) return

    const dx = playerPos.x - this.container.x
    const dy = playerPos.y - this.container.y
    const distanceToPlayer = Math.hypot(dx, dy)
    const angleToPlayer = Math.atan2(dy, dx)

    this.container.rotation = angleToPlayer

    if (this.type === 'chaser') {
      this.container.x += Math.cos(angleToPlayer) * this.speed * delta
      this.container.y += Math.sin(angleToPlayer) * this.speed * delta
    } else if (this.type === 'shooter') {
      if (distanceToPlayer > 220) {
        this.container.x += Math.cos(angleToPlayer) * this.speed * delta
        this.container.y += Math.sin(angleToPlayer) * this.speed * delta
      }

      if (this.shootCooldown > 0) this.shootCooldown -= delta
      if (distanceToPlayer <= 320 && this.shootCooldown <= 0) {
        this.shootCooldown = 90
        onEnemyShoot(new Projectile(this.container.x, this.container.y, angleToPlayer, true))
      }
    }
  }

  public takeDamage(amount: number) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      this.isDead = true
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
