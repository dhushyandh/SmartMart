import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify'
import assets from '../assets/assets';
import Skeleton from '../components/Skeleton';

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {

    if (!token) {
      setLoading(false);
      return null
    };

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders);
      }
      else {
        toast.error(response.data.message)
      }

    }
    catch (error) {
      console.log(error);
      toast.error(response.data.message)
    } finally {
      setLoading(false);
    }
  }
  const updateStatus = async (e, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: e.target.value }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchAllOrders();
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch (error) {
      console.log(error);
      toast.error(response.data.message)
    }
  }

  const deleteOrder = async (orderId) => {
    if (!orderId) return
    if (!window.confirm('Delete this order?')) return

    try {
      const response = await axios.post(
        backendUrl + '/api/order/delete',
        { orderId },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Order deleted')
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete order')
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <Skeleton className='w-12 h-12 rounded' />
              <div className='flex flex-col gap-3'>
                <Skeleton className='h-4 w-3/4 rounded' />
                <Skeleton className='h-3 w-2/3 rounded' />
                <Skeleton className='h-3 w-1/2 rounded' />
              </div>
              <div className='flex flex-col gap-3'>
                <Skeleton className='h-3 w-1/2 rounded' />
                <Skeleton className='h-3 w-2/3 rounded' />
                <Skeleton className='h-3 w-1/3 rounded' />
              </div>
              <Skeleton className='h-4 w-16 rounded' />
              <Skeleton className='h-8 w-32 rounded' />
            </div>
          ))
        ) : (
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='mt-3 mb-2 font-medium' key={index}>{item.name} x {item.quantity}<span>{item.size}</span></p>
                    }
                    else {
                      return <p className='mt-3 mb-2 font-medium' key={index}>{item.name} x {item.quantity}<span>{item.size}</span>,</p>
                    }
                  })}
                </div>
                <p>{order.address.firstName + ' ' + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ','}</p>
                  <p>{order.address.city + ', ' + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <div className='flex flex-wrap items-center gap-2'>
                <select onChange={(e) => updateStatus(e, order._id)} className="p-2 font-semibold" value={order.status} >
                  <option value="OrderPlaced">OrderPlaced</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button
                  type="button"
                  onClick={() => deleteOrder(order._id)}
                  className="px-3 py-2 rounded-md border text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
