import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import Skeleton from './Skeleton';

const LatestCollection = () => {

    const { products, productsLoading } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);


    useEffect(() => {
        setLatestProducts(products.slice(0, 15));
    }, [products])

    return (
        <div className='my-10'>
            <div className="text-center py-8 text-3xl">
                <Title text1={'LATEST'} text2={'BOOKS'} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700 ">
                    Newly added academic books, organized by department for faster discovery.
                </p>
            </div>
            {/* Rendering Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {productsLoading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                            <Skeleton className="h-4 w-4/5 rounded" />
                            <Skeleton className="h-3 w-2/5 rounded" />
                        </div>
                    ))
                    : latestProducts.map((item, index) => (
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

export default LatestCollection
