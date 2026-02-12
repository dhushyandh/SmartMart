import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewLetterBox from '../components/NewLetterBox'
import axios from 'axios'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill required fields', { position: 'bottom-right', pauseOnHover: false })
      return
    }

    try {
      setSending(true)
      const res = await axios.post(`${backendUrl}/api/contact`, formData)
      if (res.data?.success) {
        toast.success('Message sent', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(res.data?.message || 'Unable to send message', { position: 'bottom-right', pauseOnHover: false })
      }
    } catch (error) {
      toast.error('Unable to send message', { position: 'bottom-right', pauseOnHover: false })
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} className='w-full md:max-w-122' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Project Contact</p>
          <p className='text-gray-500'>Department of CSE <br /> CampusCart Mini Project, College Campus</p>
          <p className='text-gray-500'>Email: campuscart@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Support</p>
          <p className='text-gray-500'>For book tagging or department updates, reach out to the project team.</p>
          <form onSubmit={handleSubmit} className='w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
            <p className='text-lg font-semibold text-gray-900'>Send a Message</p>
            <div className='mt-4 flex flex-col gap-3 text-sm'>
              <div>
                <label className='block text-gray-600 mb-1'>Name *</label>
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='Your name'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Email *</label>
                <input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='you@example.com'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Subject</label>
                <input
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='Subject'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Message *</label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-3 py-2 min-h-[110px]'
                  placeholder='Write your message'
                />
              </div>
            </div>
            <button
              type='submit'
              disabled={sending}
              className='mt-4 w-full border border-black px-6 py-3 text-sm hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-60'
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <NewLetterBox />
    </div>
  )
}

export default Contact
