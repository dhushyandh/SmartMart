import React from 'react'
import { Link } from 'react-router-dom'

const OrderSuccess = () => {
  return (
    <div className='border-t pt-16 min-h-[70vh] flex items-center justify-center'>
      <div className='bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm w-full max-w-xl'>
        <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto'>
          <svg className='w-8 h-8 text-green-600' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M5 13l4 4L19 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </div>
        <h2 className='mt-5 text-2xl font-semibold text-gray-900'>Order placed successfully</h2>
        <p className='mt-2 text-sm text-gray-500'>Thanks for your purchase. You can track the order status anytime.</p>
        <Link
          to='/orders'
          className='inline-block mt-6 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700'
        >
          Go to Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess
