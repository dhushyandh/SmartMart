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
    const [productsLoading, setProductsLoading] = useState(true);
    const [token, setToken] = useState('');
    const [cartItems, setCartItems] = useState({});
    const [userRole, setUserRole] = useState('user');
    const [locationLabel, setLocationLabel] = useState('');
    const [wishlistItems, setWishlistItems] = useState([]);

    const navigate = useNavigate();

    // 1. TOKEN HANDLER (The "Catcher")
    // Runs once when the app starts to check for Google Token or LocalStorage
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");

        if (tokenFromUrl) {
            // Case: Returning from Google Login
            localStorage.setItem('token', tokenFromUrl);
            setToken(tokenFromUrl);
            // Clean the URL bar immediately
            window.history.replaceState({}, document.title, window.location.pathname);
            toast.success("Logged in with Google",{
                position: 'bottom-right',
                pauseOnHover: false,
                autoClose: 3000
            });
        } else {
            // Case: Normal refresh or manual login
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
            }
        }
    }, []);

    // 2. INITIALIZE CART FROM LOCAL STORAGE
    useEffect(() => {
        const localCart = localStorage.getItem('cartItems');
        if (localCart) {
            try {
                setCartItems(JSON.parse(localCart));
            } catch (error) {
                setCartItems({});
            }
        }
    }, []);

    // 3. SYNC CART TO LOCAL STORAGE
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlistItems');
        if (storedWishlist) {
            try {
                setWishlistItems(JSON.parse(storedWishlist));
            } catch (error) {
                setWishlistItems([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    useEffect(() => {
        const savedLocation = localStorage.getItem('locationLabel');
        if (savedLocation) {
            setLocationLabel(savedLocation);
        }
    }, []);

    useEffect(() => {
        if (locationLabel) {
            localStorage.setItem('locationLabel', locationLabel);
        } else {
            localStorage.removeItem('locationLabel');
        }
    }, [locationLabel]);

    // 4. LOGOUT FUNCTION
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        setToken('');
        setCartItems({});
        navigate('/login');
    };

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select book format', { position: 'bottom-right', pauseOnHover: false });
            return;
        }

        const product = products.find((item) => item._id === itemId);
        if (product && typeof product.stock === 'number' && product.stock <= 0) {
            toast.warn('This book is currently out of stock', { position: 'bottom-right', pauseOnHover: false });
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        toast.success('Added to cart', { position: 'bottom-right', pauseOnHover: false, autoClose: 2000 });

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        if (!products.length) return 0;

        for (const productId in cartItems) {
            const product = products.find((p) => p._id === productId);
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

    const toggleWishlist = (itemId) => {
        setWishlistItems((prev) => {
            const exists = prev.includes(itemId);
            const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
            if (!exists) {
                toast.success('Added to wishlist', {
                    position: 'bottom-right',
                    pauseOnHover: false,
                    autoClose: 2000
                });
            }
            return next;
        });
    };

    const isInWishlist = (itemId) => wishlistItems.includes(itemId);

    const getWishlistCount = () => wishlistItems.length;

    const getProductsData = async () => {
        setProductsLoading(true);
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProductsLoading(false);
        }
    };

    const getUserCart = async (currentToken) => {
        if (!currentToken) return;
        try {
            const response = await axios.post(
                backendUrl + '/api/cart/get',
                {},
                { headers: { token: currentToken } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            setUserRole('user');
            return;
        }

        let decodedRole = '';
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            decodedRole = decoded.role || '';
        } catch (error) {
            decodedRole = '';
        }

        if (decodedRole) {
            setUserRole(decodedRole);
            return;
        }

        const fetchRole = async () => {
            try {
                const response = await axios.post(
                    backendUrl + '/api/user/profile',
                    {},
                    { headers: { token } }
                );
                if (response.data.success) {
                    setUserRole(response.data.user?.role || 'user');
                } else {
                    setUserRole('user');
                }
            } catch (error) {
                setUserRole('user');
            }
        };

        fetchRole();
    }, [token, backendUrl]);

    const value = {
        products, productsLoading, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken, logout,
        locationLabel, setLocationLabel,
        userRole,
        wishlistItems, toggleWishlist, isInWishlist, getWishlistCount
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;