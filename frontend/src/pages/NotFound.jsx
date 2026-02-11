import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="border-t pt-12 pb-16">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        <div className="w-full max-w-md">
          <svg viewBox="0 0 480 360" role="img" aria-label="Page not found" className="w-full h-auto">
            <defs>
              <linearGradient id="nf-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#f8fafc" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="480" height="360" rx="24" fill="url(#nf-gradient)" />
            <circle cx="140" cy="150" r="80" fill="#e5e7eb" />
            <circle cx="320" cy="130" r="60" fill="#e5e7eb" />
            <rect x="120" y="200" width="240" height="16" rx="8" fill="#cbd5f5" />
            <rect x="160" y="228" width="160" height="12" rx="6" fill="#d1d5db" />
            <text x="240" y="180" textAnchor="middle" fontSize="42" fill="#111827" fontFamily="Outfit, sans-serif">404</text>
          </svg>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Page not found</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            The page you are looking for does not exist. Try searching from the collections page or head back home.
          </p>
        </div>

        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
