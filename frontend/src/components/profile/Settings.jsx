import React, { useContext, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../../context/ShopContext'
import { toast } from 'react-toastify'

const Settings = () => {
  const { logout, backendUrl, token } = useContext(ShopContext)
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: ''
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
      </div>

      <button
        type="button"
        onClick={() => setShowPasswordModal(true)}
        className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm flex items-center justify-between text-left hover:border-gray-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10V8a6 6 0 0112 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">Password Manager</p>
            <p className="text-sm text-gray-500">Change your password securely</p>
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <p className="text-base font-semibold text-gray-900">Account Settings</p>

        <div className="mt-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              <p className="text-sm text-gray-500">Receive important updates</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifications((prev) => !prev)}
              className={`w-12 h-6 rounded-full flex items-center px-1 transition ${notifications ? 'bg-gray-900' : 'bg-gray-300'}`}
              aria-pressed={notifications}
            >
              <span className={`w-4 h-4 rounded-full bg-white transition ${notifications ? 'translate-x-6' : ''}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Email Updates</p>
              <p className="text-sm text-gray-500">Get newsletter and offers</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailUpdates((prev) => !prev)}
              className={`w-12 h-6 rounded-full flex items-center px-1 transition ${emailUpdates ? 'bg-gray-900' : 'bg-gray-300'}`}
              aria-pressed={emailUpdates}
            >
              <span className={`w-4 h-4 rounded-full bg-white transition ${emailUpdates ? 'translate-x-6' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="w-full border border-red-300 bg-red-50 text-red-600 rounded-2xl py-3 text-sm font-semibold hover:bg-red-100"
      >
        Sign Out
      </button>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Password Manager</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full border rounded-xl px-4 py-2 pr-12 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  >
                    {showCurrent ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
                <div className="relative">
                  <input
                    type={showNext ? 'text' : 'password'}
                    value={passwords.next}
                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full border rounded-xl px-4 py-2 pr-12 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNext((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  >
                    {showNext ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full border rounded-xl px-4 py-2 pr-12 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
                <span className="font-semibold">Password requirements:</span> At least 8 characters with a mix of letters and numbers.
              </div>

              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl border text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingPassword}
                onClick={async () => {
                  setPasswordError('')
                  if (!passwords.current || !passwords.next || !passwords.confirm) {
                    setPasswordError('Please fill all password fields.')
                    return
                  }
                  if (passwords.next !== passwords.confirm) {
                    setPasswordError('New passwords do not match.')
                    return
                  }
                  if (passwords.next.length < 8) {
                    setPasswordError('Password must be at least 8 characters.')
                    return
                  }

                  try {
                    setSavingPassword(true)
                    const res = await axios.put(
                      `${backendUrl}/api/user/profile/password`,
                      { oldPassword: passwords.current, newPassword: passwords.next },
                      { headers: { token } }
                    )

                    if (res.data?.success) {
                      setShowPasswordModal(false)
                      setPasswords({ current: '', next: '', confirm: '' })
                      toast.success('Password updated', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 })
                    } else {
                      setPasswordError(res.data?.message || 'Unable to update password.')
                      toast.error(res.data?.message || 'Unable to update password.', { position: 'bottom-right', pauseOnHover: false })
                    }
                  } catch (error) {
                    setPasswordError('Unable to update password.')
                    toast.error('Unable to update password.', { position: 'bottom-right', pauseOnHover: false })
                  } finally {
                    setSavingPassword(false)
                  }
                }}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
