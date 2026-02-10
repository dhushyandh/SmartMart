import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem'
import Skeleton from '../components/Skeleton'

const Collection = () => {

  const { products, search, productsLoading } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState('relavant');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }
  const applyFilter = () => {
    let productsCopy = products.slice()

    if (search) {
      productsCopy = productsCopy.filter(item =>
        `${item.name || item.title || ''} ${item.author || ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.includes(item.department || item.category)
      )
    }

    setFilterProducts(productsCopy)
  }


  const sortProduct = () => {

    let fpcopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpcopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpcopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter()
  }, [products, category, search])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer'>FILTER BY DEPARTMENT</p>
        <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
        {/* Categories Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>DEPARTMENTS</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" className="w-3" value={'CSE'} onChange={toggleCategory} />CSE
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" className="w-3" value={'IT'} onChange={toggleCategory} />IT
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" className="w-3" value={'ECE'} onChange={toggleCategory} />ECE
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" className="w-3" value={'EEE'} onChange={toggleCategory} />EEE
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" className="w-3" value={'AIDS'} onChange={toggleCategory} />AIDS
            </p>
          </div>
        </div>
      </div>
      {/* Right-Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'BOOKS'} />
          {/* Product-Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
            <option value="relavant">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {productsLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                  <Skeleton className="h-3 w-2/5 rounded" />
                </div>
              ))
            : filterProducts.map((item, index) => (
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} />
              ))}
        </div>
      </div>
    </div>
  )
}

export default Collection
