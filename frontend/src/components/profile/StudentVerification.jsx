import React, { useState } from 'react'
import axios from 'axios'
import { FaCamera } from 'react-icons/fa'
import { ShopContext } from '../../context/ShopContext'
import { useContext } from 'react'

const StudentVerification = () => {
  const { backendUrl, token } = useContext(ShopContext)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setStatus('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please capture a photo first.')
      return
    }

    if (!token) {
      setStatus('Please log in to submit verification.')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('studentId', file)

      const response = await axios.post(`${backendUrl}/api/student/verify`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data?.verification) {
        setStatus('Student ID uploaded. Verification pending.')
      } else {
        setStatus('Upload completed.')
      }
    } catch (error) {
      setStatus('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Student Verification</h2>

      <h4 className="mt-4 text-base font-semibold text-gray-900">
        Capture the <span className="text-blue-600">Back Side</span> of Your Student ID
      </h4>

      <p className="mt-2 text-sm text-gray-600">
        Take a live photo of the back side of your valid college ID card
        where your Roll Number and Duration are printed.
      </p>

      <div className="mt-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl p-4 text-sm">
        <p className="font-semibold mb-2">Important Instructions:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensure Roll Number and Duration are clearly visible</li>
          <li>Remove the ID from any cover or sleeve</li>
          <li>Use good lighting and keep the camera steady</li>
        </ul>
      </div>

      <div className="mt-6 border-2 border-dashed border-gray-300 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-600 relative overflow-hidden">
        {preview ? (
          <img src={preview} alt="Student ID" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="bg-gray-100 text-gray-700 rounded-2xl w-12 h-12 flex items-center justify-center">
              <FaCamera />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-800">Capture Photo</p>
            <small className="text-xs text-gray-500">Direct Camera Only</small>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Submit for Verification'}
        </button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  )
}

export default StudentVerification
