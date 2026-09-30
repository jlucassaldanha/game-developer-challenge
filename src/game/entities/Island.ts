import { Container, Graphics } from 'pixi.js'

export class Island {
  public container: Container
  private sprite: Graphics
  public radius: number

  constructor(x: number, y: number, radius = 70) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.radius = radius

    this.sprite = new Graphics()
      .circle(0, 0, radius)
      .fill(0x2a9d8f)
      .stroke({ width: 6, color: 0xe9c46a })

    this.container.addChild(this.sprite)
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
