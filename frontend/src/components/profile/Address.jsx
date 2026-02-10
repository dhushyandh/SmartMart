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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Saved Address</h2>
      <div className="mt-4">
        <label className="block text-sm text-gray-600 mb-1">Default Address</label>
        <input
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Enter your address"
        />
        <button
          onClick={handleManualSave}
          className="mt-3 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
        >
          Save Address
        </button>
      </div>
      <button
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        onClick={getLocation}
      >
        <FaMapMarkerAlt />
        Use Current Location
      </button>
      {loading && <p className="mt-3 text-sm text-gray-500">Fetching location...</p>}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {savedAddress && !loading && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Saved Address</p>
            <button
              type="button"
              onClick={deleteAddress}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-700">{savedAddress}</p>
        </div>
      )}
    </div>
  )
}

export default Address
