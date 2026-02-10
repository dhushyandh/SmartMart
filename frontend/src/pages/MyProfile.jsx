import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import ProfilePage from '../components/profile/ProfilePage'
import Skeleton from '../components/Skeleton'

const MyProfile = () => {
  const { backendUrl, token, setLocationLabel } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const res = await axios.post(
          backendUrl + '/api/user/profile',
          {},
          { headers: { token } }
        )

        if (res.data.success) {
          setUser(res.data.user)
          if (res.data.user?.address) {
            setLocationLabel(res.data.user.address)
          }
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadProfile()
    } else {
      setLoading(false)
    }
  }, [backendUrl, token])

  if (loading) {
    return (
      <div className="border-t pt-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return <ProfilePage user={user} onUserUpdate={setUser} />
}

export default MyProfile
