import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Searchbar from './components/Searchbar'
import MobileBottomNav from './components/MobileBottomNav'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MyProfile from './pages/MyProfile'
import OrderSuccess from './pages/OrderSuccess'
import NotFound from './pages/NotFound'



const App = () => {
  return (
    <div className='px-4 pb-24 sm:pb-0 sm:px-[5vw] md:px=[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <Searchbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/book/:id' element={<BookDetails />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='cart' element={<Cart />} />
        <Route path='login' element={<Login />} />
        <Route path='place-order' element={<PlaceOrder />} />
        <Route path='orders' element={< Orders />} />
        <Route path='order-success' element={<OrderSuccess />} />
        <Route path='verify' element={< Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer />
      <MobileBottomNav />
    </div >
  )
}

export default App
