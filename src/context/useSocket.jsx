import React, { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom'
import { io } from 'socket.io-client'

const URL = 'http://localhost:3000/'
const SocketContext = createContext();


export const SocketProvider = ({ children }) => {
    const socket = io.connect(URL);
    return (
        <SocketContext.Provider value={{ socket }}>
            <Outlet />
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};