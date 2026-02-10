import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import Skeleton from './Skeleton'

const BestSeller = () => {

  const { products, productsLoading } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    const bestProducts = products.filter(item => item.bestseller === true)

    setBestSeller(bestProducts.slice(0, 10));
  }, [products]);


  return (
    <div className='my-10'>
      <div className="text-center text-3xl py-8">
        <Title text1={'TOP'} text2={'PICKS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          High-demand titles from CSE, IT, ECE, EEE, and AIDS departments.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {productsLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-2/5 rounded" />
              </div>
            ))
          : bestSeller.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            ))}
      </div>
    </div>
  )
}

export default BestSeller
