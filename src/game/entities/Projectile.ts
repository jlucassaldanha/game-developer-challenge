import { Container, Graphics, Sprite, Texture } from 'pixi.js'

export class Projectile {
  public container: Container
  private sprite: Sprite | Graphics
  public isEnemy: boolean
  public isDead = false
  private speed = 8
  private angle: number
  private lifeTime = 120

  constructor(x: number, y: number, angle: number, isEnemy = false, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.angle = angle
    this.isEnemy = isEnemy

    if (texture && texture instanceof Texture) {
      const s = new Sprite(texture)
      s.anchor.set(0.5)
      s.width = 12
      s.height = 12
      this.sprite = s
      this.container.addChild(s)
    } else {
      this.sprite = new Graphics()
        .circle(0, 0, 4)
        .fill(isEnemy ? 0xe63946 : 0xffb703)
      this.container.addChild(this.sprite)
    }
  }

  public update(delta: number, bounds: { width: number; height: number }) {
    this.container.x += Math.cos(this.angle) * this.speed * delta
    this.container.y += Math.sin(this.angle) * this.speed * delta

    this.lifeTime -= delta
    if (
      this.lifeTime <= 0 ||
      this.container.x < 0 ||
      this.container.x > bounds.width ||
      this.container.y < 0 ||
      this.container.y > bounds.height
    ) {
      this.isDead = true
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
