import { Container, Graphics, Sprite, Texture } from 'pixi.js'

export class Projectile {
  public container: Container
  public isEnemy: boolean
  public isDead = false
  public radius = 5

  private speed = 7.5
  private rotation: number
  private lifeTime = 0
  private maxLifeTime = 120

  constructor(x: number, y: number, rotation: number, isEnemy = false, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.rotation = rotation
    this.isEnemy = isEnemy

    if (texture) {
      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.width = 12
      sprite.height = 12
      this.container.addChild(sprite)
    } else {
      const g = new Graphics()
      const color = isEnemy ? 0xd90429 : 0xffb703
      g.circle(0, 0, this.radius).fill(color)
      this.container.addChild(g)
    }
  }

  public update(delta: number, bounds: { width: number; height: number }) {
    this.container.x += Math.cos(this.rotation) * this.speed * delta
    this.container.y += Math.sin(this.rotation) * this.speed * delta

    this.lifeTime += delta
    if (this.lifeTime >= this.maxLifeTime) {
      this.isDead = true
    }

    if (
      this.container.x < -20 ||
      this.container.x > bounds.width + 20 ||
      this.container.y < -20 ||
      this.container.y > bounds.height + 20
    ) {
      this.isDead = true
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
