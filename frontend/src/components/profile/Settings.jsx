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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Account Preferences</h2>
        <p className="mt-2 text-sm text-slate-600">Control how we notify you and keep your account secure.</p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="rounded-2xl border border-slate-200 p-5 text-left hover:border-slate-300 bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-700 shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10V8a6 6 0 0112 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">Password Manager</p>
                <p className="text-sm text-slate-500">Change your password securely</p>
              </div>
            </div>
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-base font-semibold text-slate-900">Notifications</p>

            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">App Alerts</p>
                  <p className="text-sm text-slate-500">Receive order and delivery updates</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications((prev) => !prev)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition ${notifications ? 'bg-slate-900' : 'bg-slate-300'}`}
                  aria-pressed={notifications}
                >
                  <span className={`w-4 h-4 rounded-full bg-white transition ${notifications ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Updates</p>
                  <p className="text-sm text-slate-500">Get newsletter and offers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailUpdates((prev) => !prev)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition ${emailUpdates ? 'bg-slate-900' : 'bg-slate-300'}`}
                  aria-pressed={emailUpdates}
                >
                  <span className={`w-4 h-4 rounded-full bg-white transition ${emailUpdates ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="w-full border border-rose-200 bg-rose-50 text-rose-600 rounded-2xl py-3 text-sm font-semibold hover:bg-rose-100"
      >
        Sign Out
      </button>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Password Manager</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 pr-12 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                  >
                    {showCurrent ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password *</label>
                <div className="relative">
                  <input
                    type={showNext ? 'text' : 'password'}
                    value={passwords.next}
                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 pr-12 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNext((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                  >
                    {showNext ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 pr-12 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700">
                <span className="font-semibold">Password requirements:</span> At least 8 characters with a mix of letters and numbers.
              </div>

              {passwordError && (
                <p className="text-sm text-rose-600">{passwordError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
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
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
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
