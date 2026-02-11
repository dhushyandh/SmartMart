import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import Dashboard from './pages/Dashboard'
import List from './pages/List'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Reviews from './pages/Reviews'
import { useState } from 'react'
import Login from './components/Login'
import { useEffect } from 'react'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const  currency = '₹'


const App = () => {

  const [token, setToken] = useState(
    localStorage.getItem('adminToken') && localStorage.getItem('adminToken') !== 'undefined'
      ? localStorage.getItem('adminToken')
      : ''
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token)
    } else {
      localStorage.removeItem('adminToken')
    }
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      {token === '' ?
        <Login setToken={setToken} />
        :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] ml-[max(5vw,25px)] my-8 text-gray-800 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/users' element={<Users token={token} />} />
                <Route path='/reviews' element={<Reviews token={token} />} />
              </Routes>
            </div>
          </div>
        </>}

    </div>
  )
}

export default App
