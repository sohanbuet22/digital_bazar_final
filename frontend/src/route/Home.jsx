import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/homepage.css";
import icon from '../images/Icon.png';

const HomePage = () => {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const visibleCount = 5;

  // ✅ Check login status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:4000/isAuthenticate", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/products");
        setAllProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const getVisibleProducts = () => {
    return allProducts.slice(startIndex, startIndex + visibleCount);
  };

  const handleSeeMore = () => {
    setStartIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex + visibleCount > allProducts.length ? 0 : nextIndex;
    });
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="websiteHeader">
        <img className="iconImage" src={icon} alt="Site Icon" />
        <span id="websiteName">DIGITAL BAZAAR</span>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">Menu</li>
          <li className="nav-item category-item">
            Categories
            <ul className="category-dropdown">
              <li className="category-option">Electronics</li>
              <li className="category-option">Fashion</li>
              <li className="category-option">Home & Kitchen</li>
              <li className="category-option">Books</li>
              <li className="category-option">Toys</li>
              <li className="category-option">Sports</li>
              <li className="category-option">Beauty</li>
              <li className="category-option">Grocery</li>
              <li className="category-option">Automotive</li>
              <li className="category-option">Health</li>
            </ul>
          </li>
          <li className="nav-item">Help</li>
          <li className="nav-item">About Us</li>
        </ul>

        <div className="nav-actions">
          <input type="text" placeholder="Search..." className="search-input" />
          {!isLoggedIn ? (
            <li className="nav-item login-item">
              Login
              <ul className="login-dropdown">
                <li className="login-option" onClick={() => navigate('/CustomerLogin')}>Customer</li>
                <li className="login-option">Seller</li>
                <li className="login-option">Delivery Man</li>
              </ul>
            </li>
          ) : (
            <li className="nav-item login-item">
              Account
              <ul className="login-dropdown">
                <li className="login-option" onClick={() => navigate('/profile')}>Profile</li>
                <li className="login-option" onClick={handleLogout}>Logout</li>
              </ul>
            </li>
          )}

          <span
            className="nav-action-item"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/CartItems")}
          >
            Cart
          </span>
        </div>
      </nav>

      {/* Popular Products Section */}
      <section className="products-section">
        <h2 className="section-title">Popular Products</h2>
        <div className="products-row">
          {getVisibleProducts().map((product, index) => (
            <div
              key={`${product.product_id}-${index}`}
              className="product-card"
              onClick={() => navigate(`/product/${product.product_id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`/${product.image_url}` || "https://via.placeholder.com/250?text=No+Image"}
                alt={product.product_name}
                className="product-img"
              />
              <p className="product-name">{product.product_name}</p>
              <p className="product-price">Price: <s>৳{product.actual_price}</s></p>
              <p className="product-discount">Discount: ৳{product.discount}</p>
              <p className="product-actual-price">Selling Price: ৳{product.selling_price}</p>
            </div>
          ))}
        </div>

        {allProducts.length > visibleCount && (
          <div className="see-more-container">
            <button className="see-more-btn" onClick={handleSeeMore}>
              See More
            </button>
          </div>
        )}
      </section>

      {/* Review Section */}
      <section className="review-section">
        <h2 className="section-title">Customer Reviews</h2>
        <div className="reviews-container">
          <div className="review-card">
            <p className="review-text">"Amazing product quality and fast delivery!"</p>
            <p className="review-author">— John D.</p>
          </div>
          <div className="review-card">
            <p className="review-text">"Excellent customer service, highly recommend."</p>
            <p className="review-author">— Sarah K.</p>
          </div>
          <div className="review-card">
            <p className="review-text">"Great value for money. Will buy again."</p>
            <p className="review-author">— Mike P.</p>
          </div>
          <div className="review-card">
            <p className="review-text">"Product matches description perfectly."</p>
            <p className="review-author">— Emma L.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-links">
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms of Service</span>
          <span className="footer-link">Contact Us</span>
          <span className="footer-link">Email: support@digitalbazaar.com</span>
          <span className="footer-link">FAQs</span>
        </div>
        <p className="footer-copy">&copy; 2025 Digital Bazaar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
