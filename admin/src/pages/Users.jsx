import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'

const Users = ({ token }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/user/list', {
        headers: { token }
      })

      if (response.data.success) {
        setUsers(response.data.users || [])
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  return (
    <div>
      <h3 className="text-xl font-semibold">Users</h3>
      <p className="text-sm text-gray-600 mt-1">All registered users</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">Total users: {loading ? '...' : users.length}</p>
        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="hidden md:grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-4 px-2 py-2 text-sm text-gray-500 border-b">
          <p>Name</p>
          <p>Email</p>
          <p>Role</p>
          <p>Joined</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr_1fr] gap-4 px-2 py-3 border rounded-lg">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="text-sm text-gray-500 py-6 text-center">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr_1fr] gap-4 px-2 py-3 border rounded-lg text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{user.name || '-'}</p>
                <p className="break-all">{user.email || '-'}</p>
                <p className="capitalize">{user.role || 'user'}</p>
                <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Users
