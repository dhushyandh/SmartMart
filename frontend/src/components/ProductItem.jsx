import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link to={`/product/${id}`} className="text-gray-700">
            <div className="overflow-hidden">
                <img
                    src={image?.[0]?.url}
                    className="hover:scale-110 transition"
                    alt={name}
                />
            </div>
            <p className="pt-3 text-sm">{name}</p>
            <p className="text-sm font-medium">{currency} {price}</p>
        </Link>
    );
};


export default ProductItem
