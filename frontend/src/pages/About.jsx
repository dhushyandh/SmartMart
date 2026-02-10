import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewLetterBox from '../components/NewLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'SMARTMART'} />
      </div>
      <div className='mt-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} className='w-full md:max-w-112.5' alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>SmartMart is a department-wise online bookstore for college students to quickly discover and purchase academic books relevant to their discipline.</p>
          <p>Every book is tagged with a department label (CSE, IT, ECE, EEE, AIDS) and can be searched by title and author for faster discovery.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Provide a centralized, user-friendly platform that reduces search time and helps students access syllabus-aligned books in one place.</p>
        </div>
      </div>
      <div className='mt-10 text-gray-600'>
        <h3 className='text-lg font-semibold text-gray-800'>Abstract</h3>
        <p className='mt-3'>
          SmartMart is a department-wise online bookstore platform designed for college students to quickly discover and purchase academic books relevant to their specific disciplines.
          It addresses the problem of searching through large, generic catalogs by tagging every book with a department label and providing targeted filters for department, title, and author.
          The system uses the MERN stack to deliver a responsive web interface, scalable APIs, and a flexible database.
        </p>
      </div>
      <div className='mt-8 text-gray-600'>
        <h3 className='text-lg font-semibold text-gray-800'>Synopsis</h3>
        <p className='mt-3'>Academic platforms often lack structured department filtering, which increases search time and reduces relevance.</p>
        <p className='mt-3 font-semibold text-gray-800'>Objectives</p>
        <ul className='list-disc pl-6 mt-2'>
          <li>Provide a department-wise catalog for quick discovery.</li>
          <li>Enable search by department, book name, and author.</li>
          <li>Support student login, browsing, and cart management.</li>
          <li>Allow admins to add, update, and delete books with tags.</li>
        </ul>
        <p className='mt-4 font-semibold text-gray-800'>MERN Stack Usage</p>
        <ul className='list-disc pl-6 mt-2'>
          <li>MongoDB for book, user, and cart data.</li>
          <li>Express.js APIs for authentication and filtering.</li>
          <li>React.js UI for browsing and cart workflows.</li>
          <li>Node.js backend for business logic and integrations.</li>
        </ul>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'PROJECT'} text2={'HIGHLIGHTS'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Problem Focused</b>
          <p className='text-gray-600'>Solves the real issue of finding department-specific academic books on generic platforms.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>MERN Stack</b>
          <p className='text-gray-600'>Built using MongoDB, Express.js, React.js, and Node.js for a full-stack workflow.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Filter-First UI</b>
          <p className='text-gray-600'>Department filters, title search, and cart management streamline the student journey.</p>
        </div>
      </div>
      <NewLetterBox />
    </div>
  )
}

export default About
