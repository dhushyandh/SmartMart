import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import Skeleton from '../components/Skeleton'

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/admin/overview', {
        headers: { token }
      })

      if (response.data.success) {
        setStats(response.data.stats)
      } else {
        setStats(null)
      }
    } catch (error) {
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [token])

  return (
    <div>
      <h3 className="text-3xl font-semibold text-gray-900">Dashboard</h3>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl text-amber-500">₹</div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              {loading ? (
                <Skeleton className="h-6 w-24 rounded mt-2" />
              ) : (
                <p className="text-2xl font-semibold text-gray-900">
                  {currency}{stats?.totalAmount?.toFixed(2) || '0.00'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Products"
          count={stats?.productsCount}
          loading={loading}
          link="/list"
          accent="bg-emerald-50 text-emerald-600"
        />
        <DashboardCard
          title="Orders"
          count={stats?.ordersCount}
          loading={loading}
          link="/orders"
          accent="bg-rose-50 text-rose-500"
        />
        <DashboardCard
          title="Users"
          count={stats?.usersCount}
          loading={loading}
          link="/users"
          accent="bg-blue-50 text-blue-600"
        />
        <DashboardCard
          title="Out of Stock"
          count={stats?.outOfStockCount}
          loading={loading}
          link="/list"
          accent="bg-amber-50 text-amber-500"
        />
      </div>
    </div>
  )
}

const DashboardCard = ({ title, count, loading, link, accent }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${accent}`}>
            <span className="text-lg">●</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            {loading ? (
              <Skeleton className="h-6 w-12 rounded mt-2" />
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{count ?? 0}</p>
            )}
          </div>
        </div>
        <Link to={link} className="text-sm text-orange-500 font-semibold hover:text-orange-600">
          View Details →
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
