import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewLetterBox from '../components/NewLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='mt-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} className='w-full md:max-w-112.5' alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut ad temporibus harum possimus neque repellendus consequuntur placeat fuga atque perferendis?</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis quod velit delectus neque dolorem dolores qui et.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore suscipit sunt consectetur at commodi voluptate qui accusamus fugiat exercitationem amet ex dignissimos doloribus, temporibus optio unde error. Minus?</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non reiciendis doloribus expedita labore hic!</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Conveninece</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non reiciendis doloribus expedita labore hic!</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non reiciendis doloribus expedita labore hic!</p>
        </div>
      </div>
      <NewLetterBox />
    </div>
  )
}

export default About
