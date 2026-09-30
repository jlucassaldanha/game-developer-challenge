import { Container, Graphics } from 'pixi.js' 
import { InputManager } from '../systems/InputManager' 

export class PlayerShip { 
  public container: Container 
  private sprite: Graphics

  private speed = 0 
  private maxSpeed = 4 
  private acceleration = 0.15 
  private friction = 0.98 
  private rotationSpeed = 0.04 

  public hp = 100 
  public maxHp = 100 
  
  constructor(x: number, y: number) { 
    this.container = new Container() 
    this.container.x = x 
    this.container.y = y 

    // Navio provisório desenhado (Triângulo/Seta apontando para a direita = 0 radianos) 
    this.sprite = new Graphics() 

    this.sprite.poly([20, 0, -15, -10, -15, 10])
    this.sprite.fill(0xe63946) 
    this.sprite.stroke({ width: 2, color: 0xffffff }) 
    
    this.container.addChild(this.sprite) 
  } 
  
  public update(delta: number, input: InputManager, bounds: { width: number; height: number }) {  
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
  } 
  
  public destroy() { 
    this.container.destroy({ children: true }) 
  } 
}