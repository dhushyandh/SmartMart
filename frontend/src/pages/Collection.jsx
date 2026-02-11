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
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [semesterFilters, setSemesterFilters] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('');
  const allowedDepartments = ['CSE', 'IT', 'ECE', 'EEE', 'AIDS']

  const getDepartmentValue = (item) => {
    if (allowedDepartments.includes(item?.department)) return item.department
    if (allowedDepartments.includes(item?.category)) return item.category
    return ''
  }

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
    setShowFilter(false)
  }

  const toggleSemester = (e) => {
    const value = e.target.value
    if (semesterFilters.includes(value)) {
      setSemesterFilters((prev) => prev.filter((item) => item !== value))
    } else {
      setSemesterFilters((prev) => [...prev, value])
    }
    setShowFilter(false)
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
        category.includes(getDepartmentValue(item))
      )
    }

    if (semesterFilters.length > 0) {
      productsCopy = productsCopy.filter((item) => {
        const itemSemester = String(item.semester || '').trim()
        return semesterFilters.includes(itemSemester)
      })
    }

    if (ratingFilter !== '') {
      const minimumRating = Number(ratingFilter)
      if (!Number.isNaN(minimumRating)) {
        productsCopy = productsCopy.filter((item) => {
          const reviews = Array.isArray(item.reviews) ? item.reviews : []
          if (reviews.length === 0) return false
          const total = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0)
          const average = total / reviews.length
          return average >= minimumRating
        })
      }
    }

    const minPrice = priceRange.min !== '' ? Number(priceRange.min) : null
    const maxPrice = priceRange.max !== '' ? Number(priceRange.max) : null

    if (minPrice !== null && !Number.isNaN(minPrice)) {
      productsCopy = productsCopy.filter(item => Number(item.price) >= minPrice)
    }

    if (maxPrice !== null && !Number.isNaN(maxPrice)) {
      productsCopy = productsCopy.filter(item => Number(item.price) <= maxPrice)
    }

    const sorted = productsCopy.slice()
    if (sortType === 'low-high') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortType === 'high-low') {
      sorted.sort((a, b) => b.price - a.price)
    }

    setFilterProducts(sorted)
  }

  useEffect(() => {
    applyFilter()
  }, [products, category, semesterFilters, ratingFilter, search, priceRange, sortType])

  useEffect(() => {
    if (category.length === 0) {
      setSemesterFilters([])
    }
  }, [category])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      {showFilter && (
        <div className='min-w-60'>
          <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer'>FILTER BY DEPARTMENT</p>
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
          {/* Categories Filter */}
          <div className='border border-gray-300 pl-5 py-3 mt-6'>
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
          <div className='border border-gray-300 pl-5 py-3 mt-6'>
            <p className='mb-3 text-sm font-medium'>PRICE RANGE</p>
            <div className='flex flex-col gap-3 text-sm text-gray-700 pr-5'>
              <input
                type='number'
                min='0'
                placeholder='Min price'
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  setShowFilter(false)
                }}
                className='border border-gray-300 px-2 py-1 rounded'
              />
              <input
                type='number'
                min='0'
                placeholder='Max price'
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  setShowFilter(false)
                }}
                className='border border-gray-300 px-2 py-1 rounded'
              />
            </div>
          </div>
          <div className='border border-gray-300 pl-5 py-3 mt-6'>
            <p className='mb-3 text-sm font-medium'>RATING</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              {['4', '3', '2', '1'].map((value) => (
                <label key={value} className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='rating-filter'
                    className='w-3'
                    value={value}
                    checked={ratingFilter === value}
                    onChange={(e) => {
                      setRatingFilter(e.target.value)
                      setShowFilter(false)
                    }}
                  />
                  {value}+ stars
                </label>
              ))}
              <button
                type='button'
                onClick={() => setRatingFilter('')}
                className='text-xs text-gray-500 hover:text-gray-700 w-fit'
              >
                Clear rating filter
              </button>
            </div>
          </div>
          {category.length > 0 && (
            <div className='border border-gray-300 pl-5 py-3 mt-6'>
              <p className='mb-3 text-sm font-medium'>SEMESTER</p>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                {['1', '2', '3', '4', '5', '6', '7'].map((value) => (
                  <p key={value} className='flex gap-2'>
                    <input
                      type='checkbox'
                      className='w-3'
                      value={value}
                      onChange={toggleSemester}
                      checked={semesterFilters.includes(value)}
                    />
                    Semester {value}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Right-Side */}
      <div className='flex-1'>
        {!showFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilter(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              <span className="text-lg">←</span>
              Back to filters
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory([])
                setSemesterFilters([])
                setPriceRange({ min: '', max: '' })
                setRatingFilter('')
              }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Clear filters
            </button>
          </div>
        )}
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
        {productsLoading ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-2/5 rounded" />
              </div>
            ))}
          </div>
        ) : filterProducts.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center text-sm text-gray-500">
            Nothing found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection
