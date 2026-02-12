import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewLetterBox from '../components/NewLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'CAMPUSCART'} />
      </div>
      <div className='mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center'>
        <div className='space-y-6 text-gray-600'>
          <p className='text-lg text-gray-800 font-semibold'>Built for campus life.</p>
          <p>
            CampusCart is a department-first bookstore for college students. Instead of
            digging through massive catalogs, you can browse curated academic titles by
            department and semester in seconds.
          </p>
          <p>
            We keep discovery simple with fast search by title and author, clean
            filtering by department, and a focused collection tailored to your syllabus.
          </p>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-center'>
            <div className='rounded-2xl border px-4 py-3'>
              <p className='text-lg font-semibold text-gray-900'>5+</p>
              <p className='text-xs text-gray-500'>Departments</p>
            </div>
            <div className='rounded-2xl border px-4 py-3'>
              <p className='text-lg font-semibold text-gray-900'>100+</p>
              <p className='text-xs text-gray-500'>Academic Titles</p>
            </div>
            <div className='rounded-2xl border px-4 py-3'>
              <p className='text-lg font-semibold text-gray-900'>Fast</p>
              <p className='text-xs text-gray-500'>Search + Filters</p>
            </div>
            <div className='rounded-2xl border px-4 py-3'>
              <p className='text-lg font-semibold text-gray-900'>Secure</p>
              <p className='text-xs text-gray-500'>Checkout</p>
            </div>
          </div>
        </div>
        <div className='relative'>
          <img src={assets.about_img} className='w-full rounded-3xl border shadow-sm' alt="" />
        </div>
      </div>

      <div className='mt-12 text-gray-600'>
        <h3 className='text-lg font-semibold text-gray-800'>What makes CampusCart different</h3>
        <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
          <div className='rounded-2xl border p-6 space-y-3'>
            <h4 className='text-gray-900 font-semibold'>Department-first catalog</h4>
            <p>Books are organized by department so you find relevant titles quickly.</p>
          </div>
          <div className='rounded-2xl border p-6 space-y-3'>
            <h4 className='text-gray-900 font-semibold'>Student-friendly flow</h4>
            <p>Simple browsing, wishlist, and cart tools built for fast decisions.</p>
          </div>
          <div className='rounded-2xl border p-6 space-y-3'>
            <h4 className='text-gray-900 font-semibold'>Reliable administration</h4>
            <p>Admins can update stock, pricing, and tags with minimal effort.</p>
          </div>
        </div>
      </div>

      <div className='text-xl py-6'>
        <Title text1={'HOW'} text2={'IT WORKS'} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-20 text-gray-600'>
        <div className='border rounded-2xl px-8 py-8 flex flex-col gap-4'>
          <b className='text-gray-900'>Browse by department</b>
          <p>Pick your department and see the most relevant academic books.</p>
        </div>
        <div className='border rounded-2xl px-8 py-8 flex flex-col gap-4'>
          <b className='text-gray-900'>Search and shortlist</b>
          <p>Filter by title or author and save items to wishlist or cart.</p>
        </div>
        <div className='border rounded-2xl px-8 py-8 flex flex-col gap-4'>
          <b className='text-gray-900'>Checkout securely</b>
          <p>Complete purchase with a smooth, secure checkout experience.</p>
        </div>
      </div>
      <NewLetterBox />
    </div>
  )
}

export default About
