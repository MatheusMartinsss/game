import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './routes/Game.jsx'
import Home from './routes/Home.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import { SocketProvider } from './context/useSocket.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route 
    element={<SocketProvider />}
    >
      <Route path='/' element={<Home />} />
      <Route path='/room/:roomId' element={<Game />} />
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
