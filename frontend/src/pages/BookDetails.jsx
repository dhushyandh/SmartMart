import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'

const BookDetails = () => {
  const { id } = useParams()
  const { products, currency, addToCart, backendUrl, toggleWishlist, isInWishlist, token, navigate } = useContext(ShopContext)
  const [book, setBook] = useState(null)
  const [image, setImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadBook = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/books/${id}`)
      const data = response.data?.book || response.data
      if (data) {
        setBook(data)
        setImage(data.images?.[0]?.url || assets.hero_img)
        setIsLoading(false)
        return
      }
    } catch (error) {
      // Fallback to local data if API fails.
    }

    const localBook = products.find((item) => item._id === id)
    if (localBook) {
      setBook(localBook)
      setImage(localBook.images?.[0]?.url || assets.hero_img)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (id) {
      loadBook()
    }
  }, [id, products])

  if (isLoading) {
    return (
      <div className='border-t-2 pt-10'>
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col gap-3 sm:w-[18.7%] w-full">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-[24%] sm:w-full aspect-square rounded-lg" />
              ))}
            </div>
            <div className="w-full sm:w-[80%]">
              <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
            </div>
          </div>
          <div className="flex-1">
            <Skeleton className="h-7 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded mt-4" />
            <Skeleton className="h-4 w-2/3 rounded mt-2" />
            <Skeleton className="h-8 w-32 rounded mt-6" />
            <Skeleton className="h-20 w-full rounded mt-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-36 rounded" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return <div className='border-t-2 pt-10 text-gray-500'>Unable to load book details.</div>
  }

  const title = book.title || book.name || 'Untitled Book'
  const author = book.author || 'Not specified'
  const department = book.department || book.category || 'General'
  const edition = book.edition || 'N/A'
  const semester = book.semester || 'N/A'
  const publisher = book.publisher || 'N/A'
  const imageList = book.images?.length ? book.images : [{ url: assets.hero_img }]
  const reviews = book.reviews || []

  const handleSubmitReview = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    if (!comment.trim()) {
      toast.error('Please write a review', { position: 'bottom-right', pauseOnHover: false })
      return
    }

    try {
      setSubmitting(true)
      const res = await axios.post(
        `${backendUrl}/api/product/review`,
        { productId: book._id, rating, comment: comment.trim() },
        { headers: { token } }
      )

      if (res.data?.success) {
        setBook((prev) => ({ ...prev, reviews: res.data.reviews || [] }))
        setComment('')
        setRating(5)
        toast.success('Review added', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 })
      } else {
        toast.error(res.data?.message || 'Unable to add review', { position: 'bottom-right', pauseOnHover: false })
      }
    } catch (error) {
      toast.error('Unable to add review', { position: 'bottom-right', pauseOnHover: false })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Book Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overscroll-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {imageList.map((item, index) => (
              <img
                key={index}
                src={item.url}
                onClick={() => setImage(item.url)}
                className='w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer'
                alt=""
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt="" />
          </div>
        </div>

        {/* ------------ Book Info ------------- */}
        <div className="flex-1">
          <h1 className='font-medium text-2xl mt-3'>{title}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>{122}</p>
          </div>
          <p className='mt-2 text-gray-600'>Author: {author}</p>
          <p className='text-gray-600'>Department: {department}</p>
          <p className='mt-5 text-3xl font-medium'>{currency}{book.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'> {book.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 text-sm text-gray-700">
            <div className="border rounded p-3 bg-gray-50">
              <p className="text-gray-500">Edition</p>
              <p className="font-medium">{edition}</p>
            </div>
            <div className="border rounded p-3 bg-gray-50">
              <p className="text-gray-500">Semester</p>
              <p className="font-medium">{semester}</p>
            </div>
            <div className="border rounded p-3 bg-gray-50">
              <p className="text-gray-500">Publisher</p>
              <p className="font-medium">{publisher}</p>
            </div>
            <div className="border rounded p-3 bg-gray-50">
              <p className="text-gray-500">Department</p>
              <p className="font-medium">{department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => addToCart(book._id, 'Standard')} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'>ADD TO CART</button>
            <button
              type="button"
              onClick={() => toggleWishlist(book._id)}
              className="w-11 h-11 rounded-full border flex items-center justify-center text-gray-700 hover:text-red-500"
              aria-label="Toggle wishlist"
            >
              {isInWishlist(book._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>
          <hr className='mt-8 sm:w-4/5' />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Verified academic editions.</p>
            <p>Cash on delivery is available for eligible orders.</p>
            <p>Return within 7 days for damaged copies.</p>
          </div>
        </div>
      </div>

      {/* --------- Description & review Section ---------- */}
      <div className='mt-20'>
        <div className='flex'>
          <p className='border px-5 py-3 text-sm'>Description</p>
          <p className="border px-5 py-3 text-sm">Reviews {reviews.length}</p>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6 text-sm text-gray-500">
          <p>This academic book includes core concepts, unit-wise coverage, and examples aligned with common university syllabi.</p>
          <p>Check edition, author details, and department tag before ordering.</p>
        </div>

        <div className="border rounded-2xl p-5 mt-6">
          <h3 className="text-base font-semibold text-gray-900">Write a Review</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]"
                placeholder="Share your thoughts about this book"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitReview}
              className="px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {reviews.length === 0 ? (
            <div className="border rounded-2xl p-6 text-sm text-gray-500">No reviews yet. Be the first to review.</div>
          ) : (
            reviews
              .slice()
              .reverse()
              .map((review, index) => (
                <div key={`${review.userId || 'user'}-${index}`} className="border rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{review.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">
                      {review.date ? new Date(review.date).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">Rating: {review.rating}/5</p>
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))
          )}
        </div>
      </div>

      {/* ------ display related product -------- */}
      <RelatedProducts department={department} />
    </div>
  )
}

export default BookDetails
