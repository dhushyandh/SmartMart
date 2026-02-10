import { assets } from '../assets/assets'
import { FaInstagram, FaGithub, FaFacebook, FaTwitter, FaEnvelope, FaArrowUp } from 'react-icons/fa'
import { useEffect, useState } from 'react'

const Footer = () => {

  const [showTop, setShowTop] = useState(false)


  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='px-6 relative'>

      
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
            SmartMart is a department-wise online bookstore for college students,
            focused on CSE, IT, ECE, EEE, and AIDS academic titles.
          </p>

          
          <div className="flex gap-4 mt-4 text-xl text-gray-600">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="mailto:smartmart856@email.com"><FaEnvelope /></a>
          </div>
        </div>

        
        <div>
          <p className='text-xl font-medium mb-5'>SMARTMART</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About SmartMart</li>
            <li>Departments</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        
        <div>
          <p className='text-xl font-medium mb-5'>Get In Touch</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>smartmart.project@gmail.com</li>
            <li>College Campus, Dept. of CSE</li>
          </ul>
        </div>
      </div>

      
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2026 © All Rights Reserved
        </p>
      </div>

      
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <FaArrowUp />
        </button>
      )}

    </div>
  )
}

export default Footer
