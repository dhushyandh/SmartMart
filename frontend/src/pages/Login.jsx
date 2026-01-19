import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from "@react-oauth/google";


const Login = () => {

  const [currState, setCurrState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')






  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else {
          toast.error(response.data.message, {
            position: 'bottom-right',
            pauseOnHover: false,
          })
        }
      }
      else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message, {
            position: 'bottom-right',
            pauseOnHover: false,
          })
        }
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: 'bottom-right',
        pauseOnHover: false,
      })
    }
  }
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token])

  return (
    <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl font-semibold'>{currState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
      <div className="w-full flex items-center justify-between text-sm -mt-2">
        <p className='cursor-pointer'>Forget Your Password ?</p>
        {
          currState === 'Login' ?
            <p className='cursor-pointer' onClick={() => setCurrState('Sign Up')}>Create Account</p> :
            <p className='cursor-pointer' onClick={() => setCurrState('Login')}>Already Have An Account ?</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer'>{currState === 'Login' ? 'Login' : 'Sign Up'}</button>
      <div className="mt-4">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await axios.post(
                backendUrl + "/api/auth/google",
                { credential: credentialResponse.credential }
              );

              if (res.data.success) {
                setToken(res.data.token);
                localStorage.setItem("token", res.data.token);
                navigate("/");
              }
            } catch {
              toast.error("Google login failed");
            }
          }}
          onError={() => toast.error("Google login cancelled")}
        />
      </div>
    </form>
  )
}

export default Login
