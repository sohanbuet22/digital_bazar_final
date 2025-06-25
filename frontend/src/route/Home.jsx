import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/homepage.css";
import icon from "../images/Icon.png";

const HomePage = () => {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  // State for product section scrolling
  const [productStartIndex, setProductStartIndex] = useState(0);
  const visibleProductCount = 5; // Number of products visible at once

  // State for hero section image carousel
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const scrollingImages = [
    "/images/earbuds.jpg",
    "/images/cloths1.jpg",
    "/images/cloths2.jpg",
  ];

  // Fetch products on component mount
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

  // Automatic scrolling for hero section images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % scrollingImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [scrollingImages.length]);

  // Get products to display in the product row
  const getVisibleProducts = () => {
    // Ensure we loop back if we reach the end of the products array
    const productsToDisplay = [];
    for (let i = 0; i < visibleProductCount; i++) {
      productsToDisplay.push(
        allProducts[
          (productStartIndex + i) % allProducts.length
        ]
      );
    }
    return productsToDisplay.filter(Boolean); // Filter out any undefined if allProducts is not yet loaded
  };


  // Handle scrolling for product section
  const handleProductScroll = (direction) => {
    setProductStartIndex((prev) => {
      let newIndex = prev + direction;

      // Wrap around logic
      if (newIndex < 0) {
        newIndex = allProducts.length - 1; // Go to the last product
      } else if (newIndex >= allProducts.length) {
        newIndex = 0; // Go back to the first product
      }
      return newIndex;
    });
  };

  return (
    <div className="container">
      <div className="websiteHeader">
        <img className="iconImage" src={icon} alt="Site Icon" />
        <span id="websiteName">DIGITAL BAZAAR</span>
      </div>

      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">Menu</li>
          <li className="nav-item category-item">
            Categories
            <ul className="category-dropdown">
              <li className="category-option" onClick={()=>navigate('/CategoryPage/Electronics')}>Electronics</li>
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
          <li className="nav-item login-item">
            {" "}
            {/* Added relative positioning */}
            Login
            <ul className="login-dropdown">
              <li
                className="login-option"
                onClick={() => navigate("/CustomerLogin")}
              >
                Customer
              </li>
              <li className="login-option">Seller</li>
              <li className="login-option">Delivery Man</li>
            </ul>
          </li>
          <span className="nav-action-item" onClick={() => navigate("/CartItems")}>
            Cart
          </span>
        </div>
      </nav>

      <section className="hero-section">
        <div className="scrolling-container">
          {scrollingImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`scrolling-image ${
                index === heroImageIndex ? "active" : ""
              }`}
            />
          ))}
        </div>

        <div className="floating-text">
          <h1 className="hero-title">Welcome to Digital Bazaar</h1>
          <p className="hero-subtitle">Your One-Stop Destination for Quality Products</p>
          <p className="hero-description">
            Discover amazing deals, authentic products, and exceptional service.
          </p>
        </div>
      </section>

      <section className="products-section">
        <h2 className="section-title">Popular Products</h2>
        <div className="products-navigation">
          <button className="arrow-btn" onClick={() => handleProductScroll(-1)}>
            &#8592;
          </button>
          <div className="products-row">
            {allProducts.length > 0 ? (
              getVisibleProducts().map((product, index) => (
                <div
                  key={`${product.product_id}-${index}`}
                  className="product-card"
                  onClick={() => navigate(`/product/${product.product_id}`)}
                >
                  <img
                    src={
                      `/${product.image_url}` ||
                      "https://via.placeholder.com/250?text=No+Image"
                    }
                    alt={product.product_name}
                    className="product-img"
                  />
                  <p className="product-name">{product.product_name}</p>
                  <p className="product-price">
                    Price: <s>৳{product.actual_price}</s>
                  </p>
                  <p className="product-discount">Discount: ৳{product.discount}</p>
                  <p className="product-actual-price">
                    Selling Price: ৳{product.selling_price}
                  </p>
                </div>
              ))
            ) : (
              <p>No products to display.</p>
            )}
          </div>
          <button className="arrow-btn" onClick={() => handleProductScroll(1)}>
            &#8594;
          </button>
        </div>
      </section>

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