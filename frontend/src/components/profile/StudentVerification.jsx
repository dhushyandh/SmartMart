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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Verification</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Student ID Check</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
          Live capture only
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div>
          <h4 className="text-base font-semibold text-slate-900">
            Capture the <span className="text-rose-600">back side</span> of your student ID
          </h4>
          <p className="mt-2 text-sm text-slate-600">
            Make sure the Roll Number and Duration are clearly visible. Avoid glare and keep
            the camera steady during the capture.
          </p>

          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold mb-2">Quick checklist</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Remove any cover or sleeve</li>
              <li>Use even lighting, no shadows</li>
              <li>Keep the card fully within the frame</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="border-2 border-dashed border-slate-300 rounded-3xl h-56 flex flex-col items-center justify-center text-slate-600 relative overflow-hidden bg-slate-50">
            {preview ? (
              <img src={preview} alt="Student ID" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <div className="bg-white text-slate-700 rounded-2xl w-12 h-12 flex items-center justify-center shadow-sm">
                  <FaCamera />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">Capture Photo</p>
                <small className="text-xs text-slate-500">Rear camera recommended</small>
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

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Uploading...' : 'Submit for Verification'}
            </button>
            {status && <p className="text-sm text-slate-600">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentVerification
