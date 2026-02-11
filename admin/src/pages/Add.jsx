import React from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('CSE');
  const [subCategory, setSubCategory] = useState('Textbook');
  const [department, setDepartment] = useState('CSE');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState('');
  const [semester, setSemester] = useState('');
  const [publisher, setPublisher] = useState('');
  const [sizes] = useState(['Standard']);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData()

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('department', department);
      formData.append('author', author);
      formData.append('edition', edition);
      formData.append('semester', semester);
      formData.append('publisher', publisher);

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setStock('')
        setDepartment('CSE')
        setCategory('CSE')
        setSubCategory('Textbook')
        setAuthor('')
        setEdition('')
        setSemester('')
        setPublisher('')
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error) {
      console.log(error);
      toast.error(response.data.message)
      
    }
  }

  return (
    <form onSubmit={submitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
      </div>
      <div className='flex gap-2'>
        <label htmlFor="image1">
          <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
          <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" className="" hidden />
        </label>
        <label htmlFor="image2">
          <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
          <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" className="" hidden />
        </label>
        <label htmlFor="image3">
          <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
          <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" className="" hidden />
        </label>
        <label htmlFor="image4">
          <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
          <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" className="" hidden />
        </label>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Book Title</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-125 px-3 py-2' type="text" placeholder='Type Here' required />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Book Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-125 px-3 py-2' type="text" placeholder='Write Content Here' required />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Department</p>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value)
              setCategory(e.target.value)
            }}
            className='w-full px-3 py-2'
          >
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="AIDS">AIDS</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Book Type</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2' value={subCategory}>
            <option value="Textbook">Textbook</option>
            <option value="Reference">Reference</option>
            <option value="Guide">Guide</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Book Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="250" className="w-full px-3 py-2 sm:w-30" />
        </div>
        <div>
          <p className='mb-2'>Stock</p>
          <input onChange={(e) => setStock(e.target.value)} value={stock} type="number" min="0" placeholder="0" className="w-full px-3 py-2 sm:w-30" />
        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div className='w-full sm:max-w-80'>
          <p className='mb-2'>Author</p>
          <input onChange={(e) => setAuthor(e.target.value)} value={author} className='w-full px-3 py-2' type="text" placeholder='Author name' />
        </div>
        <div className='w-full sm:max-w-48'>
          <p className='mb-2'>Edition</p>
          <input onChange={(e) => setEdition(e.target.value)} value={edition} className='w-full px-3 py-2' type="text" placeholder='e.g., 5th' />
        </div>
        <div className='w-full sm:max-w-48'>
          <p className='mb-2'>Semester</p>
          <input onChange={(e) => setSemester(e.target.value)} value={semester} className='w-full px-3 py-2' type="text" placeholder='e.g., 3' />
        </div>
      </div>
      <div className='w-full sm:max-w-80'>
        <p className='mb-2'>Publisher</p>
        <input onChange={(e) => setPublisher(e.target.value)} value={publisher} className='w-full px-3 py-2' type="text" placeholder='Publisher name' />
      </div>
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>ADD</button>
    </form>
  )
}

export default Add
