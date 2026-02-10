import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, isInWishlist } = useContext(ShopContext);

  const coverImage = image?.[0]?.url || assets.hero_img
  const wished = isInWishlist(id)

  return (
    <Link to={`/book/${id}`} className="text-gray-700 block">
      <div className="relative w-full h-70 bg-gray-50 flex items-center justify-center overflow-hidden">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 hover:text-red-500"
          aria-label="Toggle wishlist"
        >
          {wished ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <p className="pt-3 text-sm min-h-10">{name}</p>
      <p className="text-sm font-medium">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;
