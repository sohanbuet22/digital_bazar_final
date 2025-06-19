import React from 'react';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      {/* Top-right Login Button */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button
          onClick={() => navigate('/LoginOption')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>

      {/* Main Content */}
      <h2 style={{ textAlign: 'center', marginTop: '60px' }}>All Products</h2>
    </div>
  );
};

export default AllProducts;
