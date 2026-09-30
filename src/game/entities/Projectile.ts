import { Container, Graphics } from 'pixi.js'

export class Projectile {
  public container: Container
  private sprite: Graphics
  private speed = 8
  private vx: number
  private vy: number
  
  public isDead = false
  public isEnemy: boolean

  constructor(x: number, y: number, angle: number, isEnemy = false) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.container.rotation = angle
    this.isEnemy = isEnemy

    this.vx = Math.cos(angle) * this.speed
    this.vy = Math.sin(angle) * this.speed

    this.sprite = new Graphics()
      .circle(0, 0, 4)
      .fill(isEnemy ? 0xff4d4d : 0xffb703)

    this.container.addChild(this.sprite)
  }

  public update(delta: number, bounds: { width: number; height: number }) {
    this.container.x += this.vx * delta
    this.container.y += this.vy * delta

    if (
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
