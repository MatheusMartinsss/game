
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/useSocket";


function Home() {
    const { socket } = useSocket()
    const nagivate = useNavigate()
    const [name, setName] = useState('')
    const create = () => {
        socket.emit('create', {
            name
        })
    }
    const connect = () => {
        socket.emit('join', {
            name,
            roomId: name
        })
    }
    const clearRooms = () => {
        setRoom(null)
        socket.emit('clearRom')
    }
    socket.on('created', (data) => {
        if (data) {
            nagivate(`room/${data.room.id}`, {
                replace: true
            })
        }
    })

    socket.on('joined', (data) => {
        console.log('joined', data)
    })
    socket.on('joined', (data) => {
        console.log('joined', data)
    })
    socket.on('roomUpdate', (data) => {
        setRoom(data)
    })

    return (
        <>

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
                    onClick={create}
                >
                    Criar sala
                </button>
            </div>
        </>
    )
}

export default Home
