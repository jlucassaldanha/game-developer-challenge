import { Container, Graphics, Sprite, Texture } from 'pixi.js'
import { InputManager } from '../systems/InputManager'
import { Projectile } from './Projectile'

export class PlayerShip {
  public container: Container
  private sprite: Sprite | Graphics
  private healthBar: Graphics
  
  private speed = 0
  private maxSpeed = 4
  private acceleration = 0.15
  private friction = 0.98
  private rotationSpeed = 0.04

  private frontShootCooldown = 0
  private sideShootCooldown = 0

  public hp = 100
  public maxHp = 100

  constructor(x: number, y: number, texture?: Texture) {
    this.container = new Container()
    this.container.x = x
    this.container.y = y

    if (texture && texture instanceof Texture) {
      const s = new Sprite(texture)
      s.anchor.set(0.5)
      // Ajusta orientação: os sprites de navios apontam para CIMA por padrão
      // Adicionando PI/2 (90 deg), alinhamos com a direção de movimento 0 (DIREITA)
      s.rotation = Math.PI / 2
      s.width = 44
      s.height = 34
      this.sprite = s
      this.container.addChild(s)
    } else {
      this.sprite = new Graphics()
        .rect(-15, -10, 30, 20)
        .fill(0xe63946)
        .stroke({ width: 2, color: 0xffffff })
      this.container.addChild(this.sprite)
    }

    this.healthBar = new Graphics()
    this.container.addChild(this.healthBar)
    this.updateHealthBar()
  }

  public updateHealthBar() {
    this.healthBar.clear()
    
    const barWidth = 40
    const barHeight = 6
    const barX = -barWidth / 2
    const barY = -32

    this.healthBar.rect(barX, barY, barWidth, barHeight).fill(0x1b2a4a).stroke({ width: 1, color: 0x000000 })

    const pct = Math.max(0, Math.min(1, this.hp / this.maxHp))
    const fillWidth = barWidth * pct
    const fillColor = pct > 0.5 ? 0x2a9d8f : pct > 0.25 ? 0xe9c46a : 0xe63946

    if (fillWidth > 0) {
      this.healthBar.rect(barX, barY, fillWidth, barHeight).fill(fillColor)
    }
  }

  public update(
    delta: number, 
    input: InputManager, 
    bounds: { width: number; height: number },
    onShoot: (projectile: Projectile) => void,
    projectileTexture?: Texture
  ) {
    if (this.frontShootCooldown > 0) this.frontShootCooldown -= delta
    if (this.sideShootCooldown > 0) this.sideShootCooldown -= delta

    if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) {
      this.container.rotation -= this.rotationSpeed * delta
    }
    if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) {
      this.container.rotation += this.rotationSpeed * delta
    }

    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) {
      this.speed = Math.min(this.speed + this.acceleration * delta, this.maxSpeed)
    } else {
      this.speed *= Math.pow(this.friction, delta)
    }

    if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) {
      this.speed = Math.max(this.speed - (this.acceleration / 2) * delta, -this.maxSpeed / 2)
    }

    this.container.x += Math.cos(this.container.rotation) * this.speed * delta
    this.container.y += Math.sin(this.container.rotation) * this.speed * delta

    this.container.x = Math.max(30, Math.min(bounds.width - 30, this.container.x))
    this.container.y = Math.max(30, Math.min(bounds.height - 30, this.container.y))

    if (input.isKeyDown('Space') && this.frontShootCooldown <= 0) {
      this.frontShootCooldown = 15
      const p = new Projectile(this.container.x, this.container.y, this.container.rotation, false, projectileTexture)
      onShoot(p)
    }

    if ((input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight')) && this.sideShootCooldown <= 0) {
      this.sideShootCooldown = 45
      
      const leftAngle = this.container.rotation - Math.PI / 2
      const rightAngle = this.container.rotation + Math.PI / 2

      const angles = [
        leftAngle - 0.2, leftAngle, leftAngle + 0.2,
        rightAngle - 0.2, rightAngle, rightAngle + 0.2
      ]

      angles.forEach(angle => {
        onShoot(new Projectile(this.container.x, this.container.y, angle, false, projectileTexture))
      })
    }
  }

  public takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount)
    this.updateHealthBar()
  }

  public destroy() {
    this.container.destroy({ children: true })
  }
}
