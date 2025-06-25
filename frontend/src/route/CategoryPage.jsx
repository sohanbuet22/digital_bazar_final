import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/categoryProducts/${categoryName}`);
        setProducts(res.data.products);
        console.log(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="category-page">
      <h1 className="category-title">{categoryName}</h1>

      <section className="products-section">
        <h2 className="section-title">Popular Products</h2>
        <div className="products-row">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={`${product.product_id}-${index}`}
                className="product-card"
                onClick={() => handleProductClick(product.product_id)}
              >
                <img
                  src={
                    product.image_url
                      ? `/${product.image_url}`
                      : "https://via.placeholder.com/250?text=No+Image"
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
            <p>No products found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;