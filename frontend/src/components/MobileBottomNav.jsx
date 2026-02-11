import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaBookOpen, FaRegHeart, FaShoppingCart, FaUser } from 'react-icons/fa'
import { ShopContext } from '../context/ShopContext'

const MobileBottomNav = () => {
  const context = useContext(ShopContext) || {}
  const { getCartCount = () => 0, getWishlistCount = () => 0, token = '' } = context

  const profilePath = token ? '/my-profile' : '/login'
  const profileLabel = token ? 'Profile' : 'Login'

  const linkBase = 'mobile-bottom-nav__item flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold text-gray-500'

  return (
    <nav className="mobile-bottom-nav sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mobile-bottom-nav__items grid grid-cols-5 gap-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
          <NavLink to="/" end className={linkBase}>
            <FaHome className="text-base" />
            Home
          </NavLink>

          <NavLink to="/collection" className={linkBase}>
            <FaBookOpen className="text-base" />
            Shop
          </NavLink>

          <NavLink to="/wishlist" className={linkBase}>
            <span className="relative">
              <FaRegHeart className="text-base" />
              {getWishlistCount() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                  {getWishlistCount()}
                </span>
              )}
            </span>
            Wishlist
          </NavLink>

          <NavLink to="/cart" className={linkBase}>
            <span className="relative">
              <FaShoppingCart className="text-base" />
              {getCartCount() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                  {getCartCount()}
                </span>
              )}
            </span>
            Cart
          </NavLink>

          <NavLink to={profilePath} className={linkBase}>
            <FaUser className="text-base" />
            {profileLabel}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default MobileBottomNav
