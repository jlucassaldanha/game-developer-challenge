import { Container, Graphics, Sprite, Texture } from 'pixi.js'

export class Explosion {
  public container: Container
  public isDead = false
  private life = 0
  private maxLife = 20

  constructor(x: number, y: number, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y

    if (texture) {
      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.width = 45
      sprite.height = 45
      this.container.addChild(sprite)
    } else {
      const g = new Graphics()
      g.circle(0, 0, 18).fill(0xff9900)
      g.circle(0, 0, 10).fill(0xff3300)
      g.circle(0, 0, 4).fill(0xffff00)
      this.container.addChild(g)
    }
  }

  public update(delta: number) {
    this.life += delta
    const progress = this.life / this.maxLife
    this.container.scale.set(1 + progress * 0.8)
    this.container.alpha = Math.max(0, 1 - progress)

    if (this.life >= this.maxLife) {
      this.isDead = true
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
