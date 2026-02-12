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
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  const { backendUrl, token, logout, userRole } = useContext(ShopContext)
  const adminUrl = import.meta.env.VITE_ADMIN_URL

  const userName = user?.name 
  const userEmail = user?.email 
  const userPhone = user?.phone || ''
  const userRoll = user?.rollNumber || ''
  const userCollege = user?.collegeName || ''
  const userYear = user?.year || ''
  const userBatch = user?.batch || ''
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
    <div className="relative -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-semibold overflow-hidden">
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
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">My Profile</p>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">{userName}</h3>
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      {userPhone && <p>{userPhone}</p>}
                      <p>{userEmail}</p>
                      {userRoll && <p>Roll No: {userRoll}</p>}
                      {userCollege && <p>{userCollege}</p>}
                      {(userYear || userBatch) && (
                        <p>
                          {userYear ? `Year ${userYear}` : ''}
                          {userYear && userBatch ? ' · ' : ''}
                          {userBatch ? `Batch ${userBatch}` : ''}
                        </p>
                      )}
                      {joinedDate && <p className="text-xs text-slate-500">Joined {joinedDate}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {userRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => (window.location.href = adminUrl)}
                      className="border border-slate-200 bg-white text-slate-700 rounded-2xl px-4 py-2 text-xs font-semibold hover:bg-slate-50"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="border border-rose-200 bg-rose-50 text-rose-600 rounded-2xl px-4 py-2 text-xs font-semibold hover:bg-rose-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <FaShoppingCart />
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">Orders</p>
                      <p className="text-sm font-semibold text-slate-900">Track history</p>
                    </div>
                  </div>
                </button>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <FaHeart />
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">Wishlist</p>
                      <p className="text-sm font-semibold text-slate-900">Saved picks</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                      <FaMapMarkerAlt />
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {userAddress ? 'On file' : 'Add one'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Quick Actions</p>
                  <h4 className="mt-2 text-xl font-semibold">Keep your profile fresh</h4>
                  <p className="mt-2 text-sm text-slate-300">Update your details, photo, and address in seconds.</p>
                </div>
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center">
                  <FaBoxOpen className="text-xl" />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsViewing(true)}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10"
                >
                  {isEditing ? 'Close Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <Sidebar setSection={setSection} section={section} />
        <div className="space-y-6">
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
              <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="px-6 py-6">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center text-slate-500">
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
                      <p className="text-sm font-semibold text-slate-900">Profile Photo</p>
                      <label className="inline-flex items-center gap-2 mt-2 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        {isUploading ? 'Uploading...' : 'Choose Photo'}
                      </label>
                      <p className="text-xs text-slate-500 mt-1">Updates immediately after selection.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-slate-600 mb-1">Name</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Phone</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2"
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-600 mb-1">Email</label>
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          {isViewing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
                  <button
                    onClick={() => setIsViewing(false)}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="px-6 py-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center text-slate-500 text-2xl font-semibold">
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
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{userName}</h3>
                  {userPhone && <p className="text-sm text-slate-600 mt-1">{userPhone}</p>}
                  <p className="text-sm text-slate-600 mt-1">{userEmail}</p>
                  {joinedDate && <p className="text-xs text-slate-500 mt-2">Joined {joinedDate}</p>}
                </div>

                <div className="px-6 pb-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="text-xs font-semibold text-slate-500">Saved Address</p>
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
