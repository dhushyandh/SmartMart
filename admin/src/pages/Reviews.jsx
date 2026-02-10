import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/reviews', { headers: { token } })
      if (response.data.success) {
        setReviews(response.data.reviews || [])
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId, reviewId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/review/delete',
        { productId, reviewId },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Review deleted')
        await fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete review')
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [token])

  return (
    <div>
      <h3 className='text-xl font-semibold'>Reviews</h3>
      <p className='text-sm text-gray-600 mt-1'>All product reviews</p>

      <div className='mt-6 flex flex-col gap-3'>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='border rounded-xl p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-3 text-sm'>
              <Skeleton className='h-4 w-3/4 rounded' />
              <Skeleton className='h-4 w-1/2 rounded' />
              <Skeleton className='h-4 w-1/3 rounded' />
              <Skeleton className='h-7 w-20 rounded' />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className='border rounded-xl p-6 text-sm text-gray-500'>No reviews found.</div>
        ) : (
          reviews.map((review, index) => (
            <div key={`${review.reviewId}-${index}`} className='border rounded-xl p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-3 text-sm'>
              <div>
                <p className='font-semibold text-gray-900'>{review.productName}</p>
                <p className='text-gray-600 mt-1'>{review.comment || 'No comment'}</p>
                <p className='text-xs text-gray-400 mt-2'>By {review.name || 'Anonymous'}</p>
              </div>
              <div>
                <p className='text-gray-500'>Rating</p>
                <p className='font-semibold text-gray-900'>{review.rating}/5</p>
              </div>
              <div>
                <p className='text-gray-500'>Date</p>
                <p className='font-semibold text-gray-900'>
                  {review.date ? new Date(review.date).toLocaleDateString() : '-'}
                </p>
              </div>
              <div className='flex items-center justify-start md:justify-end'>
                <button
                  type='button'
                  onClick={() => handleDelete(review.productId, review.reviewId)}
                  className='px-3 py-1 rounded-md border text-red-600 hover:bg-red-50'
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

export default Reviews
