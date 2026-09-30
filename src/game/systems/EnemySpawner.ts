import { AssetManager } from './AssetManager'
import { Enemy, type EnemyType } from '../entities/Enemy'

export class EnemySpawner {
  private timer = 0
  private interval = 180 

  public update(
    delta: number,
    logicalWidth: number,
    logicalHeight: number,
    spawnCallback: (enemy: Enemy) => void
  ) {
    this.timer += delta
    if (this.timer >= this.interval) {
      this.timer = 0
      const enemy = this.spawn(logicalWidth, logicalHeight)
      spawnCallback(enemy)
    }
  }

  private spawn(width: number, height: number): Enemy {
    const side = Math.floor(Math.random() * 4)
    let x = 0
    let y = 0

    if (side === 0) {
      x = Math.random() * width
      y = 20
    } else if (side === 1) {
      x = width - 20
      y = Math.random() * height
    } else if (side === 2) {
      x = Math.random() * width
      y = height - 20
    } else {
      x = 20
      y = Math.random() * height
    }

    const type: EnemyType = Math.random() > 0.4 ? 'chaser' : 'shooter'
    const enemyTex =
      type === 'chaser'
        ? AssetManager.getTexture('chaser')
        : AssetManager.getTexture('shooter')

    return new Enemy(x, y, type, enemyTex)
  }
}
