import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import Skeleton from '../components/Skeleton'

const Wishlist = () => {
  const { products, wishlistItems, productsLoading } = useContext(ShopContext)
  const wishlistProducts = products.filter((item) => wishlistItems.includes(item._id))

  return (
    <div className="border-t pt-10">
      <div className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
        <FaHeart className="text-red-500" />
        <span>My Wishlist</span>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {wishlistItems.length} items
        </span>
      </div>

      {productsLoading ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="w-full aspect-[3/4] rounded-xl" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-3 w-2/5 rounded" />
            </div>
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <div className="text-2xl mb-4">
            <Title text1={'WISHLIST'} text2={'EMPTY'} />
          </div>
          <p className="text-sm text-gray-500">Your wishlist is empty. Add books to save them here.</p>
          <Link
            to="/collection"
            className="mt-5 inline-block bg-black text-white text-sm px-6 py-2 rounded-full"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {wishlistProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.images}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
