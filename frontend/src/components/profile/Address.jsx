import React, { useContext, useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import axios from 'axios'
import { ShopContext } from '../../context/ShopContext'
import { toast } from 'react-toastify'

const Address = () => {
  const [locationText, setLocationText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addressInput, setAddressInput] = useState('')

  const { backendUrl, token, setLocationLabel, locationLabel } = useContext(ShopContext)

  const saveAddress = async (addressValue) => {
    if (!addressValue) return
    try {
      const res = await axios.put(
        `${backendUrl}/api/user/profile/update`,
        { address: addressValue },
        { headers: { token } }
      )

      if (res.data?.success) {
        setLocationLabel(addressValue)
        setLocationText(addressValue)
        toast.success('Address saved', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 })
      }
    } catch (err) {
      setError('Unable to save address')
      toast.error('Unable to save address', { position: 'bottom-right', pauseOnHover: false })
    }
  }

  const deleteAddress = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/user/profile/update`,
        { address: '' },
        { headers: { token } }
      )

      if (res.data?.success) {
        setLocationLabel('')
        setLocationText('')
        setAddressInput('')
        toast.success('Address removed', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 })
      } else {
        toast.error(res.data?.message || 'Unable to remove address', { position: 'bottom-right', pauseOnHover: false })
      }
    } catch (err) {
      toast.error('Unable to remove address', { position: 'bottom-right', pauseOnHover: false })
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          const label = data?.display_name || `${latitude}, ${longitude}`
          setLocationText(label)
          await saveAddress(label)
        } catch (err) {
          const fallback = `${latitude}, ${longitude}`
          setLocationText(fallback)
          await saveAddress(fallback)
        } finally {
          setLoading(false)
        }
      },
      () => {
        setLoading(false)
        setError('Location permission denied')
      }
    )
  }

  const handleManualSave = async () => {
    setError('')
    await saveAddress(addressInput)
  }

  const savedAddress = locationText || locationLabel

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Addresses</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Shipping Address</h2>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
          onClick={getLocation}
        >
          <FaMapMarkerAlt />
          Use Current Location
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Default Address</label>
          <textarea
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="w-full min-h-[120px] border border-slate-200 rounded-2xl px-4 py-3 text-sm"
            placeholder="Enter your address"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleManualSave}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Save Address
            </button>
            {loading && <p className="text-sm text-slate-500">Fetching location...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Saved Address</p>
            {savedAddress && !loading && (
              <button
                type="button"
                onClick={deleteAddress}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Delete
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {savedAddress ? savedAddress : 'No address saved yet.'}
          </p>
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-xs text-slate-500">
            Keep your address updated to get faster delivery estimates.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Address
