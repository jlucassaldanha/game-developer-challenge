import { Container, Graphics, Sprite, Texture } from 'pixi.js'
import { Projectile } from './Projectile'

export type EnemyType = 'chaser' | 'shooter'

export class Enemy {
  public container: Container
  public type: EnemyType
  public radius = 22
  public hp = 40
  public maxHp = 40
  public isDead = false

  private speed = 2.0
  private shootCooldown = 0
  private healthBar: Graphics

  constructor(x: number, y: number, type: EnemyType, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.type = type

    if (this.type === 'shooter') {
      this.speed = 1.4
      this.hp = 60
      this.maxHp = 60
    }

    if (texture) {
      const s = new Sprite(texture)
      s.anchor.set(0.5)
      const aspect = s.texture.width / (s.texture.height || 1)
      s.height = 42
      s.width = 42 * aspect
      s.rotation = Math.PI / 2
      this.container.addChild(s)
    } else {
      const g = new Graphics()
      const color = this.type === 'chaser' ? 0xd90429 : 0xf77f00
      g.circle(0, 0, this.radius).fill(color)
      this.container.addChild(g)
    }

    this.healthBar = new Graphics()
    this.container.addChild(this.healthBar)
    this.updateHealthBar()
  }

  public updateHealthBar() {
    this.healthBar.clear()
    const barWidth = 32
    const barHeight = 4
    const barX = -barWidth / 2
    const barY = -28

    this.healthBar.rect(barX, barY, barWidth, barHeight).fill(0x0f172a)
    const pct = Math.max(0, this.hp / this.maxHp)
    if (pct > 0) {
      this.healthBar.rect(barX, barY, barWidth * pct, barHeight).fill(0xe63946)
    }
  }

  public update(
    delta: number,
    playerPos: { x: number; y: number },
    onShoot: (projectile: Projectile) => void,
    projectileTexture?: Texture
  ) {
    if (this.isDead) return

    const dx = playerPos.x - this.container.x
    const dy = playerPos.y - this.container.y
    const angle = Math.atan2(dy, dx)

    this.container.rotation = angle

    const dist = Math.sqrt(dx * dx + dy * dy)

    if (this.type === 'chaser') {
      this.container.x += Math.cos(angle) * this.speed * delta
      this.container.y += Math.sin(angle) * this.speed * delta
    } else if (this.type === 'shooter') {
      if (dist > 220) {
        this.container.x += Math.cos(angle) * this.speed * delta
        this.container.y += Math.sin(angle) * this.speed * delta
      }

      this.shootCooldown -= delta
      if (this.shootCooldown <= 0 && dist < 450) {
        this.shootCooldown = 90
        onShoot(new Projectile(this.container.x, this.container.y, angle, true, projectileTexture))
      }
    }
  }

  public takeDamage(amount: number) {
    this.hp -= amount
    this.updateHealthBar()
    if (this.hp <= 0) {
      this.isDead = true
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
