import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [currState, setCurrState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  // 1. Trigger Google Flow
  const googleAuth = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  // 2. Handle Manual Login/SignUp
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint = currState === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = currState === 'Sign Up' ? { name, email, password } : { email, password };
      
      const response = await axios.post(backendUrl + endpoint, payload);
      
      if (response.data.success) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken); // Save to storage
        setToken(newToken); // Update state
        toast.success(`${currState} Successful!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // 3. Redirect if logged in (works for both Google and Manual)
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
      <form onSubmit={submitHandler} className='w-full flex flex-col items-center gap-4'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl font-semibold'>{currState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>

        {currState !== 'Login' && (
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />
        )}

        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        <div className="w-full flex items-center justify-between text-sm -mt-2">
          <p onClick={() => navigate('/forgot-password')} className='cursor-pointer underline'>Forget Your Password ?</p>
          <p className='cursor-pointer hover:underline underline-offset-2 transition-all' onClick={() => setCurrState(currState === 'Login' ? 'Sign Up' : 'Login')}>
            {currState === 'Login' ? 'Create Account' : 'Already Have An Account ?'}
          </p>
        </div>

        <button className='bg-black text-white font-light w-full py-2 mt-4 cursor-pointer hover:opacity-80 transition-opacity'>
          {currState === 'Login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className='flex items-center gap-2 w-full'>
        <hr className='flex-1 border-gray-300' />
        <p className='text-gray-500 text-sm'>OR</p>
        <hr className='flex-1 border-gray-300' />
      </div>

      <button type="button" onClick={googleAuth} className='flex items-center justify-center gap-2 w-full border border-gray-800 py-2 hover:bg-gray-50 transition-all cursor-pointer'>
        <FcGoogle size={22} />
        <span>{currState === 'Login' ? 'Login' : 'Sign Up'} with Google</span>
      </button>
    </div>
  )
}

export default Login