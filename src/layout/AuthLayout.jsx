import React from 'react'
import Logo from '../components/Logo/Logo'
import { Outlet } from 'react-router'
import AuthImg from '../assets/banner/blood_donation_1.jpg'

const AuthLayout = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      {/* <Logo></Logo> */}
      <div className="flex">
        <div className="flex-1">
            <Outlet>
            </Outlet>
        </div>
        {/* <div className="flex-1">
            <img className='h-screen hidden md:block' src={AuthImg} alt="AuthImg" />
        </div> */}
      </div>
    </div>
  )
}

export default AuthLayout
