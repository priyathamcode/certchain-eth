import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Admin from './pages/Admin'
import Student from './pages/Student'
import Verify from './pages/Verify'

function App(){
  return (
    <BrowserRouter>
      <nav style={{padding:12}}>
        <Link to="/admin" style={{marginRight:8}}>Admin</Link>
        <Link to="/student" style={{marginRight:8}}>Student</Link>
        <Link to="/verify">Verify</Link>
      </nav>
      <Routes>
        <Route path="/admin" element={<Admin/>} />
        <Route path="/student" element={<Student/>} />
        <Route path="/verify" element={<Verify/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
