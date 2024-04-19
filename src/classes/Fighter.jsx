
import { Sprite } from "./Sprite";

export class Fighter extends Sprite {

    constructor({
        id = null,
        position,
        velocity = { x: 0, y: 0 },
        imageSrc,
        isFirstPlayer = false,
        lastKey = '',
        isRunning = false,
        scale = 1,
        framesMax = 1,
        direction = '',
        offset = { x: 0, y: 0 },
        sprites
    }) {
        super({
            imageSrc,
            position,
            framesMax,
            offset,
            scale
        })
        this.isFirstPlayer = isFirstPlayer
        this.direction = direction
        this.lastKey = lastKey
        this.id = id
        this.isRunning = isRunning
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    changeSprite(key) {
        switch (key) {
            case 'left': {
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'right': {
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'up': {
                if (this.image !== this.sprites.up.image) {
                    this.image = this.sprites.up.image
                    this.framesMax = this.sprites.up.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            default: {
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            }
        }
    }

    update(context) {
        this.changeSprite(this.direction)
        this.animateFrame()
        this.draw(context)
    }

}