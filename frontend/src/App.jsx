import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllProducts from './route/AllProducts';
import Home from './route/Home';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AllProducts" element={<AllProducts />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;