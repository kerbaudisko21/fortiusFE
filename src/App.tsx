import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from './pages/Home';
import Footer from './components/Footer';
import Product from './pages/Product';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminProduct from './pages/AdminProduct';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';
import { useState } from 'react';
import Cart from './pages/Cart';
import UserOrder from './pages/UserOrder';
import UserOrderDetail from './pages/UserOrderDetail';
import AdminOrder from './pages/AdminOrder';

interface NavItem {
  name: string;
  path: string;
}

function App() {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? null;
  const role = user != null ? user.role : null;  
  
  const navItems: NavItem[] = (role && role == 'admin') ? [
    { name: "Home", path: "/" },
    { name: "Product", path: "/adminproduct" },
    { name: "Order", path: "/userorder" },
  ] : [
    { name: "Home", path: "/" },
    { name: "Product", path: "/product" },
    { name: "My Order", path: "/myorder" }
  ];

  return (
    <BrowserRouter>
      <NavBar
        imageSrcPath="/src/assets/Logo letters + ribbon purple.png"
        navItems={navItems}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/product' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/adminproduct' element={<AdminProduct />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/updateproduct/:productId' element={<UpdateProduct />} />
        <Route path='/myorder' element={<UserOrder />} />
        <Route path='/userorder' element={<AdminOrder />} />
        <Route path='/userorderdetail/:transactionId' element={<UserOrderDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  ); 
}

export default App;
