import { useState } from 'react'
import Canvas from '../components/canvas'
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/useSocket';
import { Sprite } from '../classes/Sprite'
import { Room } from '../classes/Room';


const game = new Room({
    id: null,
    scenario: new Sprite({
        imageSrc: '/src/assets/background/background.png',
        framesMax: 1,
        position: {
            x: 0,
            y: 0
        }
    })
});

const Game = () => {
    const { socket } = useSocket()
    const { roomId } = useParams()
    const url = window.location.href;
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    game.id = roomId

    const startGame = () => {
        game.status = 'ready'
        startEventListener()
        setLoading(false)
    }
    const connect = () => {
        socket.emit('join', {
            name,
            roomId: roomId,
            id: socket.id
        })
    }
    socket.on('start', () => startGame())
    socket.on('update_player', (data) => {
        game.updatePlayer(data.id, data)
    })
    socket.on('joined', (data) => {
        const players = data.players
        for (const id in players) {
            if (!game.players[id]) {
                game.addPlayer(id, players[id])
            }
        }
        //startGame()
    })
    socket.on('disconnect', () => {
        game.resetGame()
        console.log('closed')
    })
    socket.on('disconnected', (id) => {
        game.removePlayer(id)
    })
    const startEventListener = () => {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyD':
                    game.players[socket.id].direction = 'right'
                    break
                case 'KeyA':
                    game.players[socket.id].direction = 'left'
                    break
                case 'KeyW':
                    game.players[socket.id].direction = 'up'
                    break
                case 'Space':

                    break
            }
        })
        window.addEventListener('keyup', (event) => {
            game.players[socket.id].direction = ''

        })

    }
    const draw = (context, canvas) => {
        let player = game.players[socket.id]
        socket.emit('update_player', { roomId, player });

        game.context = context
        game.draw()
        game.update()

    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: "5px", alignItems: 'center' }}>
                <input
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: '250px',
                        height: '40px'
                    }}
                    placeholder='Digite seu nome..'
                >
                </input>
                <button
                    style={{
                        width: '250px',
                        height: '40px'
                    }}
                    onClick={connect}
                >
                    conectar
                </button>
            </div>
            <Canvas draw={draw} height={500} width={1024} />
        </div>
    )
}

export default Game