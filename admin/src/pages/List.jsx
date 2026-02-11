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
  const [stockItem, setStockItem] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [sortType, setSortType] = useState('relavant');
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
    publisher: ''
  });
  const allowedDepartments = ['CSE', 'IT', 'ECE', 'EEE', 'AIDS']

  const getDepartmentValue = (item) => {
    if (allowedDepartments.includes(item?.department)) return item.department
    if (allowedDepartments.includes(item?.category)) return item.category
    return 'Unassigned'
  }

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
      publisher: item.publisher || ''
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

  const openStockModal = (item) => {
    setStockItem(item);
    setStockValue(typeof item?.stock === 'number' ? String(item.stock) : '0');
  }

  const updateStock = async () => {
    if (!stockItem?._id) return;

    try {
      const payload = new FormData();
      payload.append('id', stockItem._id);
      payload.append('stock', stockValue);

      const response = await axios.put(backendUrl + '/api/product/update', payload, { headers: { token } });
      if (response.data.success) {
        toast.success('Stock updated');
        setStockItem(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update stock');
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

  const filteredList = () => {
    let filtered = list.slice();

    const minPrice = priceFilter.min !== '' ? Number(priceFilter.min) : null;
    const maxPrice = priceFilter.max !== '' ? Number(priceFilter.max) : null;

    if (minPrice !== null && !Number.isNaN(minPrice)) {
      filtered = filtered.filter((item) => Number(item.price) >= minPrice);
    }

    if (maxPrice !== null && !Number.isNaN(maxPrice)) {
      filtered = filtered.filter((item) => Number(item.price) <= maxPrice);
    }

    if (sortType === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  return (
    <>
      <div className='flex flex-col gap-2 mb-4'>
        <p>All Books List</p>
        <div className='flex flex-wrap items-center gap-3 text-sm'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-600'>Min</span>
            <input
              type='number'
              min='0'
              value={priceFilter.min}
              onChange={(e) => setPriceFilter((prev) => ({ ...prev, min: e.target.value }))}
              className='border px-2 py-1 rounded w-24'
              placeholder='0'
            />
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-gray-600'>Max</span>
            <input
              type='number'
              min='0'
              value={priceFilter.max}
              onChange={(e) => setPriceFilter((prev) => ({ ...prev, max: e.target.value }))}
              className='border px-2 py-1 rounded w-24'
              placeholder='9999'
            />
          </div>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className='border px-2 py-1 rounded'
          >
            <option value='relavant'>Sort by: Relevance</option>
            <option value='low-high'>Sort by: Low to High</option>
            <option value='high-low'>Sort by: High to Low</option>
          </select>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {/* List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm '>
          <b>Image</b>
          <b>Title</b>
          <b>Department</b>
          <b>Stock</b>
          <b>Price</b>
          <b className='text-center'>Actions</b>
        </div>
        {/* -------------Product List-------------- */}
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border text-sm' key={index}>
              <Skeleton className='w-12 h-12 rounded' />
              <Skeleton className='h-4 w-3/4 rounded' />
              <Skeleton className='h-4 w-1/2 rounded' />
              <Skeleton className='h-4 w-10 rounded' />
              <Skeleton className='h-4 w-12 rounded' />
              <div className='flex items-center justify-end md:justify-center gap-3'>
                <Skeleton className='h-7 w-16 rounded' />
                <Skeleton className='h-7 w-16 rounded' />
              </div>
            </div>
          ))
        ) : (
          filteredList().map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.images?.[0]?.url} alt="" />
              <p className=''>{item.name}</p>
              <p>{getDepartmentValue(item)}</p>
              <p>{typeof item.stock === 'number' ? item.stock : 0}</p>
              <p>{currency}{item.price}</p>
              <div className='flex items-center justify-end md:justify-center gap-3 text-sm'>
                <button
                  onClick={() => openEdit(item)}
                  className='px-3 py-1 rounded-md border hover:bg-gray-50'
                >
                  Edit
                </button>
                <button
                  onClick={() => openStockModal(item)}
                  className='px-3 py-1 rounded-md border hover:bg-gray-50'
                >
                  Stock
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
      {stockItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
          <div className='w-full max-w-md rounded-2xl bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b px-6 py-4'>
              <h3 className='text-lg font-semibold'>Update Stock</h3>
              <button
                type='button'
                onClick={() => setStockItem(null)}
                className='text-gray-400 hover:text-gray-700'
                aria-label='Close'
              >
                ×
              </button>
            </div>

            <div className='px-6 py-5 space-y-4 text-sm'>
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-gray-400'>Product</p>
                <p className='mt-1 font-semibold text-gray-900'>{stockItem.name}</p>
              </div>
              <div>
                <label className='block text-gray-600 mb-1'>Stock Available</label>
                <input
                  type='number'
                  min='0'
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className='w-full border rounded-lg px-3 py-2'
                  placeholder='0'
                />
              </div>
              <p className='text-xs text-gray-500'>Stock updates immediately after saving.</p>
            </div>

            <div className='px-6 pb-6 flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => setStockItem(null)}
                className='px-4 py-2 rounded-lg border text-sm font-medium'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={updateStock}
                className='px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900'
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List
