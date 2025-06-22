import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './route/Home';
import CustomerLogin from './route/CustomerLogin';
import CustomerRegistration from './route/CustomerRegistration'
import LoginOption from './route/LoginOption'
import ProductDetails from './route/ProductDetails'
import CartProducts from './route/CartProducts';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CustomerLogin" element={<CustomerLogin/>}/>
          <Route path="/CustomerRegistration" element={<CustomerRegistration/>}/>
          <Route path="/LoginOption" element={<LoginOption/>}/>
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/CartItems" element={<CartProducts/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;