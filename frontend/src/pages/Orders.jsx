import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import Skeleton from '../components/Skeleton';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        const orderItems = []

        response.data.orders.forEach(order => {
          order.items.forEach(item => {
            orderItems.push({
              ...item,                     
              orderDate: order.date,      
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod
            })
          })
        })

        setOrderData(orderItems.reverse())
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      {loading ? (
        <div className='mt-6 flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='border rounded-xl p-4 flex flex-col gap-3'>
              <Skeleton className='h-4 w-1/2 rounded' />
              <Skeleton className='h-3 w-2/3 rounded' />
              <Skeleton className='h-3 w-1/3 rounded' />
            </div>
          ))}
        </div>
      ) : orderData.length === 0 ? (
        <div className='mt-6 bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center'>
          <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center'>
            <svg className='w-8 h-8 text-gray-400' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M4 7l8-4 8 4v10l-8 4-8-4V7z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
              <path d='M4 7l8 4 8-4' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
            </svg>
          </div>
          <h3 className='mt-4 text-lg font-semibold text-gray-900'>No Orders Yet</h3>
          <p className='mt-2 text-sm text-gray-500'>Start shopping to see your orders here!</p>
          <button
            onClick={() => window.location.href = '/collection'}
            className='mt-5 bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700'
          >
            Start Shopping
          </button>
        </div>
      ) : (
      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img src={item.images?.[0]?.url} className='w-16 sm:w-20' alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p >{currency}{item.price}</p>
                    <p>Quantity:{item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.orderDate).toDateString()}</span></p>
                  <p className='mt-2'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
              </div>
            </div>
          ))
        }
      </div>
      )}
    </div>
  )
}

export default Orders
