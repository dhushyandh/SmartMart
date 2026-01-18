import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useEffect } from 'react';

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const sessionId = searchParams.get('session_id');

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null
            }
            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { sessionId }, { headers: { token } })
            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            }
            else {
                navigate('/cart')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(() => {
        verifyPayment();
    }, [token])
    return (
        <div>

        </div>
    )
}

export default Verify
