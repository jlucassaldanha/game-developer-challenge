import { checkCircleCollision } from '../utils/collision'
import { PlayerShip } from '../entities/PlayerShip'
import { Enemy } from '../entities/Enemy'
import { Island } from '../entities/Island'
import { Projectile } from '../entities/Projectile'

export class CollisionManager {
  public static handlePlayerIslandCollisions(player: PlayerShip, islands: Island[]) {
    for (const island of islands) {
      if (
        checkCircleCollision(
          player.container.x,
          player.container.y,
          20,
          island.container.x,
          island.container.y,
          island.radius
        )
      ) {
        const angle = Math.atan2(
          player.container.y - island.container.y,
          player.container.x - island.container.x
        )
        player.container.x = island.container.x + Math.cos(angle) * (20 + island.radius + 2)
        player.container.y = island.container.y + Math.sin(angle) * (20 + island.radius + 2)
      }
    }
  }

  public static handleEnemyIslandCollisions(enemies: Enemy[], islands: Island[]) {
    for (const enemy of enemies) {
      for (const island of islands) {
        if (
          checkCircleCollision(
            enemy.container.x,
            enemy.container.y,
            enemy.radius,
            island.container.x,
            island.container.y,
            island.radius
          )
        ) {
          const angle = Math.atan2(
            enemy.container.y - island.container.y,
            enemy.container.x - island.container.x
          )
          enemy.container.x = island.container.x + Math.cos(angle) * (enemy.radius + island.radius + 2)
          enemy.container.y = island.container.y + Math.sin(angle) * (enemy.radius + island.radius + 2)
        }
      }
    }
  }

  public static handleProjectileCollisions(
    projectiles: Projectile[],
    enemies: Enemy[],
    player: PlayerShip,
    islands: Island[],
    createExplosion: (x: number, y: number) => void,
    onEnemyKilled: () => void,
    onPlayerHit: (damage: number) => void
  ) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i]

      let hitIsland = false
      for (const island of islands) {
        if (
          checkCircleCollision(
            p.container.x,
            p.container.y,
            4,
            island.container.x,
            island.container.y,
            island.radius
          )
        ) {
          p.isDead = true
          createExplosion(p.container.x, p.container.y)
          hitIsland = true
          break
        }
      }
      if (hitIsland) continue

      if (!p.isEnemy) {
        for (const enemy of enemies) {
          if (
            !enemy.isDead &&
            checkCircleCollision(
              p.container.x,
              p.container.y,
              4,
              enemy.container.x,
              enemy.container.y,
              enemy.radius
            )
          ) {
            p.isDead = true
            enemy.takeDamage(20)
            createExplosion(p.container.x, p.container.y)

            if (enemy.isDead) {
              createExplosion(enemy.container.x, enemy.container.y)
              onEnemyKilled()
            }
            break
          }
        }
      } else {
        if (
          checkCircleCollision(
            p.container.x,
            p.container.y,
            4,
            player.container.x,
            player.container.y,
            20
          )
        ) {
          p.isDead = true
          createExplosion(p.container.x, p.container.y)
          onPlayerHit(10)
        }
      }
    }
  }
}
