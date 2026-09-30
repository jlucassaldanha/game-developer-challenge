import { Container, Graphics, Sprite, Texture } from 'pixi.js'

export class Island {
  public container: Container
  public radius: number

  constructor(x: number, y: number, radius = 130, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.radius = radius

    if (texture) {
      const s = new Sprite(texture)
      s.anchor.set(0.5)
      s.width = radius * 2.2
      s.height = radius * 2.2
      this.container.addChild(s)
    } else {
      const g = new Graphics()
      g.circle(0, 0, radius + 15).fill(0xe9c46a) 
      g.circle(0, 0, radius - 10).fill(0x2a9d8f) 
      this.container.addChild(g)
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
