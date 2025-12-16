import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../pages/Shared/Footer/Footer'
import Navbar from '../pages/Shared/Navbar/Navbar'

const Rootlayout = () => {
  return (
    <div className = 'max-w-7xl mx-auto '>
        <Navbar />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Rootlayout
