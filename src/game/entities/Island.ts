import { Container, Graphics, Sprite, Texture } from 'pixi.js'

export class Island {
  public container: Container
  private sprite?: Sprite
  public radius: number

  constructor(x: number, y: number, radius = 70, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y
    this.radius = radius

    // Desenha base circular completa de areia e vegetação no centro
    const sandBase = new Graphics()
      .circle(0, 0, radius)
      .fill(0xded29e)
      .stroke({ width: 3, color: 0xc4b272 })
    
    const grassCore = new Graphics()
      .circle(0, 0, radius * 0.7)
      .fill(0x40916c)

    this.container.addChild(sandBase)
    this.container.addChild(grassCore)

    if (texture && texture instanceof Texture) {
      const s = new Sprite(texture)
      // Garantir ancoragem centralizada para nao renderizar só um canto!
      s.anchor.set(0.5)
      s.width = radius * 1.8
      s.height = radius * 1.8
      this.sprite = s
      this.container.addChild(s)
    }
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
