import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base'>

      {/* Policy 1 */}
      <div className='flex flex-col items-center'>
        <img src={assets.exchange_icon} className='w-12 mb-5' alt="" />
        <p className='font-semibold'>Verified Editions</p>
        <p className='text-gray-400'>Syllabus-aligned titles and trusted publishers</p>
      </div>

      {/* Policy 2 */}
      <div className='flex flex-col items-center'>
        <img src={assets.quality_icon} className='w-12 mb-5' alt="" />
        <p className='font-semibold'>Department Filters</p>
        <p className='text-gray-400'>Find books by CSE, IT, ECE, EEE, and AIDS</p>
      </div>

      {/* Policy 3 */}
      <div className='flex flex-col items-center'>
        <img src={assets.support_img} className='w-12 mb-5' alt="" />
        <p className='font-semibold'>Student Support</p>
        <p className='text-gray-400'>Quick help for orders and book queries</p>
      </div>

    </div>
  )
}

export default OurPolicy
