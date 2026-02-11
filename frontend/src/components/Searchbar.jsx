import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const Searchbar = () => {

    const { search, setSearch, showSearch, setShowSearch, navigate } = useContext(ShopContext);
    const [visible, setVisible] = useState('');
    const location = useLocation();

    const handleSubmit = () => {
        if (!search.trim()) return;
        if (!location.pathname.includes('/collection')) {
            navigate('/collection');
        }
        setShowSearch(false);
    };

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    }, [location])

    return showSearch && visible ? (
        <div className='fixed inset-0 z-[60] sm:static'>
            <div className='absolute inset-0 bg-black/20 backdrop-blur-sm sm:hidden' />
            <div className='relative bg-white/95 backdrop-blur border-b shadow-sm sm:static sm:bg-gray-50 sm:border-t sm:border-b sm:shadow-none'>
                <div className='flex items-center justify-between px-4 py-3 sm:justify-center sm:gap-3'>
                    <div className='flex items-center justify-center border border-gray-400 px-4 py-2 rounded-full w-full sm:w-1/2 bg-white'>
                        <input
                            type="text"
                            placeholder='Search by title or author'
                            className='flex-1 outline-none bg-transparent text-sm'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            autoFocus
                        />
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='text-gray-600 hover:text-gray-900'
                            aria-label='Search'
                        >
                            <img src={assets.search_icon} className='w-4' alt="" />
                        </button>
                    </div>
                    <button
                        type='button'
                        className='ml-3 sm:ml-0 text-gray-500 hover:text-gray-800'
                        onClick={() => setShowSearch(false)}
                        aria-label='Close search'
                    >
                        <img src={assets.cross_icon} className='w-3' alt="" />
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

export default Searchbar
