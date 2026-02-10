import React from 'react'

const NewLetterBox = () => {
    const onsubmitHandler = (e) => {
        e.preventDefault();
    }
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe for department updates</p>
      <p className='text-gray-400 mt-3'>
        Get alerts for new academic books, updated editions, and department-wise arrivals.
      </p>
    <form onSubmit={onsubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input type="email" className='w-full sm:flex-1 outline-none' placeholder='Enter your email' />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4 cursor-pointer'>SUBSCRIBE</button>
    </form>
    </div>

  )
}

export default NewLetterBox 
