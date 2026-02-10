import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'

const List = ({ token }) => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState(['', '', '', '']);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    department: 'CSE',
    category: 'CSE',
    subCategory: 'Textbook',
    author: '',
    edition: '',
    semester: '',
    publisher: '',
    bestseller: false
  });

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        console.log(response);

        setList(response.data.products);
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch (error) {
      console.log(error);
      toast.error(response.data.message)

    }
    finally {
      setLoading(false);
    }
  }
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch (error) {
      console.log(error);
      toast.error(response.data.message)
    }
  }

  const openEdit = (item) => {
    setEditingItem(item);
    const existingImages = (item.images || []).map((img) => img?.url || '').slice(0, 4);
    setImagePreviews([
      existingImages[0] || '',
      existingImages[1] || '',
      existingImages[2] || '',
      existingImages[3] || '',
    ]);
    setImageFiles([null, null, null, null]);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      department: item.department || item.category || 'CSE',
      category: item.category || item.department || 'CSE',
      subCategory: item.subCategory || 'Textbook',
      author: item.author || '',
      edition: item.edition || '',
      semester: item.semester || '',
      publisher: item.publisher || '',
      bestseller: !!item.bestseller
    });
  }

  const updateProduct = async () => {
    if (!editingItem?._id) return;
    try {
      const payload = new FormData();
      payload.append('id', editingItem._id);
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      payload.append('category', formData.category || formData.department);
      payload.append('department', formData.department || formData.category);
      payload.append('subCategory', formData.subCategory);
      payload.append('author', formData.author);
      payload.append('edition', formData.edition);
      payload.append('semester', formData.semester);
      payload.append('publisher', formData.publisher);
      payload.append('bestseller', formData.bestseller);

      imageFiles.forEach((file, index) => {
        if (file) {
          payload.append(`image${index + 1}`, file);
        }
      });

      const response = await axios.put(backendUrl + '/api/product/update', payload, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update product');
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleImageChange = (index, file) => {
    if (!file) return;
    const nextFiles = [...imageFiles];
    const nextPreviews = [...imagePreviews];
    nextFiles[index] = file;
    nextPreviews[index] = URL.createObjectURL(file);
    setImageFiles(nextFiles);
    setImagePreviews(nextPreviews);
  }

  return (
    <>
      <p className='mb-2'>All Books List</p>
      <div className='flex flex-col gap-2'>
        {/* List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm '>
          <b>Image</b>
          <b>Title</b>
          <b>Department</b>
          <b>Price</b>
          <b className='text-center'>Actions</b>
        </div>
        {/* -------------Product List-------------- */}
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border text-sm' key={index}>
              <Skeleton className='w-12 h-12 rounded' />
              <Skeleton className='h-4 w-3/4 rounded' />
              <Skeleton className='h-4 w-1/2 rounded' />
              <Skeleton className='h-4 w-12 rounded' />
              <div className='flex items-center justify-end md:justify-center gap-3'>
                <Skeleton className='h-7 w-16 rounded' />
                <Skeleton className='h-7 w-16 rounded' />
              </div>
            </div>
          ))
        ) : (
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.images?.[0]?.url} alt="" />
              <p className=''>{item.name}</p>
              <p>{item.department || item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='flex items-center justify-end md:justify-center gap-3 text-sm'>
                <button
                  onClick={() => openEdit(item)}
                  className='px-3 py-1 rounded-md border hover:bg-gray-50'
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className='px-3 py-1 rounded-md border text-red-600 hover:bg-red-50'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {editingItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
          <div className='w-full max-w-3xl rounded-2xl bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b px-6 py-4'>
              <h3 className='text-lg font-semibold'>Edit Book</h3>
              <button
                type='button'
                onClick={() => setEditingItem(null)}
                className='text-gray-400 hover:text-gray-700'
                aria-label='Close'
              >
                ×
              </button>
            </div>

            <div className='px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div className='md:col-span-2'>
                <label className='block text-gray-600 mb-2'>Product Images</label>
                <div className='flex flex-wrap gap-3'>
                  {imagePreviews.map((preview, index) => (
                    <label
                      key={index}
                      htmlFor={`edit-image-${index}`}
                      className='w-20 h-20 border rounded-lg flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50'
                    >
                      {preview ? (
                        <img src={preview} alt="" className='w-full h-full object-cover' />
                      ) : (
                        <span className='text-xs text-gray-400'>Add</span>
                      )}
                      <input
                        id={`edit-image-${index}`}
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageChange(index, e.target.files?.[0])}
                        hidden
                      />
                    </label>
                  ))}
                </div>
                <p className='text-xs text-gray-500 mt-2'>Upload new images to replace the current set.</p>
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Title</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='Book title'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Price</label>
                <input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='250'
                  type='number'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value, category: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                >
                  <option value='CSE'>CSE</option>
                  <option value='IT'>IT</option>
                  <option value='ECE'>ECE</option>
                  <option value='EEE'>EEE</option>
                  <option value='AIDS'>AIDS</option>
                </select>
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Book Type</label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                >
                  <option value='Textbook'>Textbook</option>
                  <option value='Reference'>Reference</option>
                  <option value='Guide'>Guide</option>
                </select>
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Author</label>
                <input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='Author name'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Edition</label>
                <input
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='e.g., 5th'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Semester</label>
                <input
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='e.g., 3'
                />
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Publisher</label>
                <input
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='Publisher name'
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-gray-600 mb-1'>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full border rounded-lg px-3 py-2 min-h-[110px]'
                  placeholder='Book description'
                />
              </div>
              <div className='md:col-span-2 flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='edit-bestseller'
                  checked={formData.bestseller}
                  onChange={() => setFormData({ ...formData, bestseller: !formData.bestseller })}
                />
                <label htmlFor='edit-bestseller' className='text-sm text-gray-700'>
                  Mark as bestseller
                </label>
              </div>
            </div>

            <div className='px-6 pb-6 flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => setEditingItem(null)}
                className='px-4 py-2 rounded-lg border text-sm font-medium'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={updateProduct}
                className='px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900'
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List
