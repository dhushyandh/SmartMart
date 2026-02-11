import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FaRegHeart } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const adminUrl = import.meta.env.adminUrl;

  const context = useContext(ShopContext) || {};
  const {
    setShowSearch = () => {},
    getCartCount = () => 0,
    token = '',
    logout = () => {},
    locationLabel = '',
    search = '',
    setSearch = () => {},
    userRole = 'user',
    getWishlistCount = () => 0,
  } = context;

  const formatLocation = (label) => {
    if (!label) return { title: 'Set location', subtitle: 'Choose your address' };
    const parts = label.split(',').map((part) => part.trim());
    if (parts.length === 1) return { title: parts[0], subtitle: '' };
    return { title: parts[0], subtitle: parts.slice(1, 3).join(', ') };
  };

  const { title, subtitle } = formatLocation(locationLabel);

  const handleLogout = () => {
    logout();
    setVisible(false);
    navigate('/login');
  };

  const handleSearchClick = () => {
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      setShowSearch(true);
      return;
    }

    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }

    if (search.trim() && !location.pathname.includes('/collection')) {
      setShowSearch(true);
      navigate('/collection');
    }
  };

  const handleSearchSubmit = () => {
    if (!search.trim()) return;
    setShowSearch(true);
    if (!location.pathname.includes('/collection')) {
      navigate('/collection');
    }
  };

  return (
    <div className="relative z-50 flex items-center justify-between py-6 font-medium">

      <div className="flex items-center gap-8">
        <Link to="/">
          <img src={assets.logo} className="w-36 h-10 object-contain" alt="logo" />
        </Link>
        {token && location.pathname !== '/login' && (
          <div className="hidden md:flex items-center gap-4 border-l pl-6">
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s7-5.3 7-12a7 7 0 10-14 0c0 6.7 7 12 7 12z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{title}</span>
                <svg className="w-3 h-3 text-gray-500" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
            </div>
          </div>
        )}
      </div>


      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">

        <div className={`hidden sm:flex items-center transition-all duration-300 ${searchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            placeholder="Search books"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
          {searchOpen && (
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="ml-2 text-gray-500 hover:text-gray-800"
              aria-label="Close search"
            >
              ×
            </button>
          )}
        </div>

        <img
          onClick={handleSearchClick}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="search"
        />

        <div className="group relative hidden sm:block">
          <img
            onClick={() => !token && navigate('/login')}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile"
          />

          {token && (
            <div className="group-hover:block hidden absolute right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700 rounded">
                {userRole === 'admin' && (
                  <p
                    onClick={() => (window.location.href = adminUrl)}
                    className="cursor-pointer hover:text-black"
                  >
                    Dashboard
                  </p>
                )}
                <p
                  onClick={() => navigate('/my-profile')}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate('/orders')}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/wishlist" className="relative">
          <FaRegHeart className="w-5 h-5 text-gray-700" />
          {getWishlistCount() > 0 && (
            <p className="absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center text-[10px] bg-black text-white rounded-full">
              {getWishlistCount()}
            </p>
          )}
        </Link>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="cart" />
          <p className="absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center text-[10px] bg-black text-white rounded-full">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="menu"
        />
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 bg-white overflow-hidden transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">

          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180"
              alt="back"
            />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            COLLECTIONS
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            CONTACT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/my-profile"
          >
            MY PROFILE
          </NavLink>

          {token && userRole === 'admin' && (
            <button
              onClick={() => (window.location.href =  adminUrl)}
              className="py-2 pl-6 border text-left text-gray-800 font-semibold"
            >
              DASHBOARD
            </button>
          )}
          {token && (
            <button
              onClick={handleLogout}
              className="py-2 pl-6 border text-left text-red-600 font-semibold"
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
