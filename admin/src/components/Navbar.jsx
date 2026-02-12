import React from 'react'
import assets from '../assets/assets'

const Navbar = () => {
    return (
        <div className='flex items-center py-2 px-[4%] justify-between'>
            <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        </div>
    )
}

export default Navbar
