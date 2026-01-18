import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');

    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cartItems')) || {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems || {}));
    }, [cartItems]);


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        setToken('');
        setCartItems({});
    };



    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error(('Select Product Size'), {
                position: 'bottom-right',
                pauseOnHover: false,
            })
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            }
            catch (error) {
                toast.error(error.message, {
                    position: 'bottom-right',
                    pauseOnHover: false,
                })
            }
        }
    }
    const getCartCount = () => {

        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                }
                catch (error) {
                    toast.error(error.message, {
                        position: 'bottom-right',
                        pauseOnHover: false,
                    })
                }
            }
        }
        return totalCount;
    }
    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            }
            catch (error) {
                toast.error(error.message, {
                    position: 'bottom-right',
                    pauseOnHover: false,
                })
            }
        }

    }
    const getCartAmount = () => {
        let totalAmount = 0;

        if (!products.length) return 0;

        for (const productId in cartItems) {
            const product = products.find(
                (p) => p._id === productId
            );

            if (!product) continue;

            for (const size in cartItems[productId]) {
                const quantity = cartItems[productId][size];
                if (quantity > 0) {
                    totalAmount += product.price * quantity;
                }
            }
        }

        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products);
            }
            else {
                toast.error(response.data.message, {
                    position: 'bottom-right',
                    pauseOnHover: false,
                })
            }

        }
        catch (error) {
            toast.error(response.data.message, {
                position: 'bottom-right',
                pauseOnHover: false,
            })
        }
    }

    const getUserCart = async () => {
        if (!token) return;

        try {
            const response = await axios.post(
                backendUrl + '/api/cart/get',
                {},
                {
                    headers: { token }
                }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error(error);
            setCartItems({});
        }
    };


    useEffect(() => {
        if (products.length === 0) {
            getProductsData()
        }
    }, [])

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);
    useEffect(() => {
        getUserCart();
    }, [token])



    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        logout
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;

