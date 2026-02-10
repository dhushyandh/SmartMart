import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Skeleton from '../components/Skeleton';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, productsLoading } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    const tempData = [];

    if (products.length > 0) {
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])


  return (
    <div className='border-t pt-14'>
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      {productsLoading ? (
        <div className='mt-6 flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='border rounded-xl p-4 flex items-center gap-4'>
              <Skeleton className='w-16 h-20 rounded-lg' />
              <div className='flex-1 flex flex-col gap-3'>
                <Skeleton className='h-4 w-3/4 rounded' />
                <Skeleton className='h-3 w-1/3 rounded' />
              </div>
              <Skeleton className='w-10 h-8 rounded' />
            </div>
          ))}
        </div>
      ) : cartData.length === 0 ? (
        <div className='mt-8 bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center'>
          <div className='relative w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm'>
            <img src={assets.cart_icon} alt="" className='w-9 h-9 opacity-80' />
            <span className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center'>*</span>
          </div>
          <h3 className='mt-6 text-xl font-semibold text-gray-900'>Your cart is waiting</h3>
          <p className='mt-2 text-sm text-gray-500 max-w-md'>
            Looks like you haven't added anything yet. Explore books and grab your favorites.
          </p>
          <button
            onClick={() => navigate('/collection')}
            className='mt-6 bg-gray-900 text-white text-sm px-8 py-3 rounded-full shadow hover:bg-gray-700'
          >
            Start Shopping →
          </button>
        </div>
      ) : (
        <>
          <div>
            {
              cartData.map((item, index) => {

                const productData = products.find(
                  (product) => product._id === item._id
                );

                if (!productData) return null;
                return (
                  <div
                    key={index}
                    className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
                  >
                    <div className='flex items-start gap-6'>
                      <img
                        src={productData.images?.[0]?.url}
                        className='w-16 sm:w-20'
                        alt=""
                      />
                      <div>
                        <p className='text-sm sm:text-lg font-medium'>
                          {productData.name}
                        </p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency}{productData.price}</p>
                          <p className='px-2 sm:px-3 border bg-slate-50'>
                            Format: {item.size}
                          </p>
                        </div>
                      </div>
                    </div>

                    <input
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      onChange={(e) =>
                        e.target.value === '' || e.target.value === '0'
                          ? null
                          : updateQuantity(item._id, item.size, Number(e.target.value))
                      }
                      className='border max-w-20 px-1 sm:px-2 py-1'
                    />

                    <img
                      src={assets.bin_icon}
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className='w-4 mr-4 sm:w-5 cursor-pointer'
                      alt=""
                    />
                  </div>
                );
              })
            }
          </div>
          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-112.5 '>
              <CartTotal />
              <div className='w-full text-end'>
                <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
