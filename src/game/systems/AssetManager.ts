import { Assets, Spritesheet, Texture } from 'pixi.js'

export class AssetManager {
  private static uiSpritesheet: Spritesheet | null = null
  private static textures: Record<string, Texture> = {}

  public static async loadAssets(): Promise<void> {
    try {
      const sheet = await Assets.load('/assets/spritesheet/ui_sheet.json').catch(() => null)
      if (sheet && sheet.textures) {
        this.uiSpritesheet = sheet
      }
    } catch {
    }

    const candidates: Record<string, string[]> = {
      player: [
        '/assets/png/default/ships/ship_1.png',
        '/assets/png/retina/ships/ship_1.png',
        '/assets/ships/ship_player.png',
        '/assets/ship_player.png'
      ],
      chaser: [
        '/assets/png/default/ships/ship_2.png',
        '/assets/png/retina/ships/ship_2.png',
        '/assets/ships/ship_chaser.png',
        '/assets/ship_chaser.png'
      ],
      shooter: [
        '/assets/png/default/ships/ship_3.png',
        '/assets/png/retina/ships/ship_3.png',
        '/assets/ships/ship_shooter.png',
        '/assets/ship_shooter.png'
      ],
      island: [
        '/assets/png/default/tiles/tile_01.png',
        '/assets/png/default/tiles/tile_1.png',
        '/assets/png/retina/tiles/tile_01.png',
        '/assets/tiles/island.png',
        '/assets/island.png'
      ],
      cannonball: [
        '/assets/png/default/ship_parts/cannon_ball.png',
        '/assets/png/retina/ship_parts/cannon_ball.png',
        '/assets/effects/cannonball.png',
        '/assets/cannonball.png'
      ],
      explosion: [
        '/assets/png/default/effects/explosion_1.png',
        '/assets/png/default/effects/explosion_2.png',
        '/assets/png/retina/effects/explosion.png',
        '/assets/effects/explosion.png'
      ],
      water: [
        '/assets/png/default/tiles/tile_73.png',
        '/assets/png/default/tiles/tile_72.png',
        '/assets/png/retina/tiles/tile_73.png',
        '/assets/tiles/water.png'
      ]
    }

    for (const [key, paths] of Object.entries(candidates)) {
      for (const path of paths) {
        try {
          const tex = await Assets.load(path).catch(() => null)
          if (tex && tex instanceof Texture) {
            this.textures[key] = tex
            break
          }
        } catch {
        }
      }
    }
  }

  public static getUITexture(frameName: string): Texture | undefined {
    if (!this.uiSpritesheet) return undefined
    return this.uiSpritesheet.textures[frameName] || this.uiSpritesheet.textures[`${frameName}.png`]
  }

  public static getTexture(key: string): Texture | undefined {
    const tex = this.textures[key] || this.getUITexture(key)
    return (tex && tex instanceof Texture) ? tex : undefined
  }
}
