import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 block">
      <div className="w-full h-70 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={image?.[0]?.url}
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
