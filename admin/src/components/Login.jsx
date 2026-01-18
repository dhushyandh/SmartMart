import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'


const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Login = ({ setToken }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                backendUrl + '/api/user/admin',
                { email, password }
            );

            if (response.data.success) {
                toast.success('Admin Login Successful 🚀', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'dark',
                });

                setToken(response.data.token);
            } else {
                toast.error(response.data.message || 'Invalid Credentials', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'dark',
                });
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Server Error',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'dark',
                }
            );
        }
    };


    return (
        <div className='min-h-screen flex items-center justify-center w-full '>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={submitHandler}>
                    <div className='mb-3 min-w-[72]'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@gmail.com' required />
                    </div>
                    <div className='mb-3 min-w-[72]'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter Your Password' required />
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer'>Login</button>
                </form>
            </div>
        </div>
    )
};

export default Login