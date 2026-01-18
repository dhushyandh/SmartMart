import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6'>

      {/* Layout Wrapper */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        {/* Logo + Description */}
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Labore nam minima, eligendi commodi molestias quasi!
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>HOME</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-xl font-medium mb-5'>Get In Touch</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+1-223-435-7876</li>
            <li>contact@email.com</li>
          </ul>
        </div>
      </div>
<div>
    <hr />
    <p className='py-5 text-sm text-center'>Copyright 2026@ All Rights Reserved</p>
</div>
    </div>
  )
}

export default Footer
