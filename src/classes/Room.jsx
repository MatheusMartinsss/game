import { Fighter } from "./Fighter"


export class Room {

    constructor({
        id,
        players = [],
        status = 'waiting',
        scenario,
        context
    }) {

        this.id = id
        this.players = players
        this.scenario = scenario
        this.status = status
        this.context = context
    }

    startGame() {
        this.status = 'ready'
    }
    updatePlayer(playerId, data) {
        this.players[playerId].position.x = data.position.x
        this.players[playerId].position.y = data.position.y
        this.players[playerId].velocity.x = data.velocity.x
        this.players[playerId].velocity.y = data.velocity.y
        this.players[playerId].isRunning = data.isRunning
    }
    addPlayer(id, player) {
        this.players[id] = new Fighter({
            id: id,
            imageSrc: '/src/assets/Samurai/Idle.png',
            framesMax: 6,
            lastKey: '',
            isRunning: false,
            position: {
                x: player.position.x,
                y: player.position.y
            },
            scale: 2,
            offset: {
                x: 0,
                y: 0
            },
            velocity: {
                x: 0,
                y: 0
            },
            sprites: {
                idle: {
                    imageSrc: '/src/assets/Samurai/Idle.png',
                    framesMax: 6,
                },
                run: {
                    imageSrc: '/src/assets/Samurai/Run.png',
                    framesMax: 8,
                },
                up: {
                    imageSrc: '/src/assets/Samurai/Jump.png',
                    framesMax: 12,
                }
            }
        })
    }
    removePlayer(id) {
        delete this.players[id]
    }
    resetGame() {
        this.players = []
        this.status = 'waiting'
    }
    draw() {
        // Draw background
        this.scenario.update(this.context)

        //Draw Players
        for (const player in this.players) {
            this.players[player].update(this.context)
        }
    }

    update() {
        if (Object.keys(this.players).length > 1 && this.status !== 'ready') {
            this.startGame()
        }
    }

}