const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { v4 } = require('uuid');


const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

// Set static folder
app.use(express.static("public"));

// Socket setup
const io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Players array
let rooms = []

rooms[1] = {
    id: 1,
    creatoId: 1,
    status: 'waiting',
    players: {}
}

const maxX = 850
const minX = 0
const minY = 230
const gravity = 1.8
const positions = [20, 850]
const offSet = {
    x: 0,
    y: 0
}

const createRom = (socket, data) => {
    const roomId = v4()
    rooms[roomId] = {
        id: roomId,
        creatorId: socket.id,
        status: 'waiting',
        players: {}
    }
    socket.join(roomId)
    return rooms[roomId]
}
const createPlayer = ({ id, name, isFirstPlayer }) => {
    return {
        id,
        name,
        isFirstPlayer,
        isRunning: false,
        position: {
            x: isFirstPlayer ? positions[0] : positions[1],
            y: minY
        },
        velocity: {
            x: 0,
            y: 0
        }
    }
}
io.on("connection", (socket) => {
    let _roomId;
    socket.on('create', (data) => {
        const room = createRom(socket, data)
        io.to(room.id).emit('created', { room })
    })

    socket.on('update_player', (data) => {
        const { roomId, player } = data
        if (player) {
            const { direction, id } = player

            let currentPlayer = rooms[roomId].players[id]

            if (!currentPlayer) return
            //Player moviment
            if (direction == 'right') {
                currentPlayer.velocity.x = 5
                currentPlayer.isRunning = true;
            } else if (direction == 'left') {
                currentPlayer.velocity.x = -5
                currentPlayer.isRunning = true;
            } else if (direction == 'up') {
                currentPlayer.velocity.y = -20
            }
            else {
                currentPlayer.velocity.x = 0
                currentPlayer.velocity.y = 0
                currentPlayer.isRunning = false;
            }
            currentPlayer.position.y += currentPlayer.velocity.y
            currentPlayer.position.x += currentPlayer.velocity.x

            //Map Limit
            if (currentPlayer.position.x > maxX) {
                currentPlayer.position.x = maxX;
            } else if (currentPlayer.position.x < minX) {
                currentPlayer.position.x = minX;
            }

            if (currentPlayer.position.y < minY) {
                currentPlayer.velocity.y = gravity
            } else {
                currentPlayer.velocity.y = 0
            }

            currentPlayer.position.y += currentPlayer.velocity.y

            // update player
            rooms[roomId].players[id] = currentPlayer

            io.to(roomId).emit('update_player', currentPlayer)
        }
    })

    socket.on('join', (data) => {
        const { roomId, name, id } = data

        const currentRoom = rooms[roomId]
        let numberOfPlayers = currentRoom?.players ? Object.keys(currentRoom.players).length : 0

        currentRoom.players[id] = createPlayer({
            id: id,
            name: name,
            isFirstPlayer: numberOfPlayers === 0
        })
        numberOfPlayers++

        rooms[roomId] = currentRoom

        _roomId = roomId
        socket.join(roomId)

        io.to(roomId).emit('joined', currentRoom)
        if (numberOfPlayers >= 1) {
            io.to(roomId).emit('start')
        }
    })

    socket.on('clearRom', () => {
        rooms = []
    })
    socket.on('disconnect', () => {
        if (rooms[_roomId]?.players[socket.id]) {
            io.to(_roomId).emit('disconnected', rooms[_roomId].players[socket.id].id)
            delete rooms[_roomId].players[socket.id]
        }

    })
});

function updatePlayerPosition(roomId, id) {
    const player = rooms[roomId].players[id];

    if (!player || !player.isRunning) return;

    player.position.x += player.velocity.x;

    io.to(roomId).emit('update_player', player);
}



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));