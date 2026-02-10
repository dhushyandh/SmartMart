import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaMapMarkerAlt, FaShoppingCart, FaBoxOpen, FaHeart } from 'react-icons/fa'
import Sidebar from './Sidebar'
import StudentVerification from './StudentVerification'
import Address from './Address'
import Settings from './Settings'
import { ShopContext } from '../../context/ShopContext'
import { useContext } from 'react'
import { toast } from 'react-toastify'

const ProfilePage = ({ user, onUserUpdate }) => {
  const [section, setSection] = useState('student')
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const { backendUrl, token } = useContext(ShopContext)

  const userName = user?.name 
  const userEmail = user?.email 
  const userPhone = user?.phone || ''
  const userAddress = user?.address || ''
  const avatarUrl = avatarPreview || user?.avatar || user?.googleImage || ''
  const avatarLetter = userName?.[0]?.toUpperCase() 
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
  }, [user])

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/user/profile/update`,
        formData,
        { headers: { token } }
      )

      if (res.data?.success) {
        onUserUpdate?.(res.data.user || formData)
        setIsEditing(false)
        toast.success('Profile updated', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 })
      } else {
        toast.error(res.data?.message || 'Unable to update profile', { position: 'bottom-right', pauseOnHover: false })
      }
    } catch (error) {
      toast.error('Unable to update profile', { position: 'bottom-right', pauseOnHover: false })
    }
  }

  const resolveAvatarUrl = (value) => {
    if (!value) return ''
    if (value.startsWith('http')) return value
    const normalized = value.replace(/\\/g, '/').replace(/^\//, '')
    return `${backendUrl}/${normalized}`
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    setIsUploading(true)

    const form = new FormData()
    form.append('image', file)

    try {
      const res = await axios.post(`${backendUrl}/api/user/profile/image`, form, {
        headers: { token }
      })

      if (res.data?.success) {
        onUserUpdate?.(res.data.user)
      }
    } catch (error) {
      // Keep UI stable if upload fails.
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-slate-50 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]">
      <div className="bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <div className="w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center text-xl font-semibold bg-gray-800 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={resolveAvatarUrl(avatarUrl)}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{userName}</h3>
              {userPhone && <p className="text-sm text-gray-200">{userPhone}</p>}
              <p className="text-sm text-gray-200">{userEmail}</p>
              {joinedDate && <p className="text-xs text-gray-300 mt-1">Joined: {joinedDate}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsViewing(true)}
              className="px-5 py-2 rounded-xl bg-gray-800 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700"
            >
              View Profile
            </button>
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="px-5 py-2 rounded-xl bg-gray-800 text-white text-sm font-medium border border-gray-700 hover:bg-gray-700"
            >
              {isEditing ? 'Close' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <Sidebar setSection={setSection} section={section} />
        <div>
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="px-6 py-5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center text-gray-500">
                      {avatarUrl ? (
                        <img
                          src={resolveAvatarUrl(avatarUrl)}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Profile Photo</p>
                      <label className="inline-flex items-center gap-2 mt-2 px-3 py-2 text-sm font-medium border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        {isUploading ? 'Uploading...' : 'Choose Photo'}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Updates immediately after selection.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-gray-600 mb-1">Name</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Phone</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-600 mb-1">Email</label>
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          {isViewing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
                  <button
                    onClick={() => setIsViewing(false)}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="px-6 py-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center text-gray-500 text-2xl font-semibold">
                    {avatarUrl ? (
                      <img
                        src={resolveAvatarUrl(avatarUrl)}
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{userName}</h3>
                  {userPhone && <p className="text-sm text-gray-600 mt-1">{userPhone}</p>}
                  <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
                  {joinedDate && <p className="text-xs text-gray-500 mt-2">Joined {joinedDate}</p>}
                </div>

                <div className="px-6 pb-6">
                  <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-700">
                    <p className="text-xs font-semibold text-gray-500">Saved Address</p>
                    <p className="mt-2">{userAddress || 'No address saved yet.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {section === 'student' && <StudentVerification />}
          {section === 'address' && <Address />}
          {section === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
