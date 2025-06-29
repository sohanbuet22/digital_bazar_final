import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/productDetails.css";
import icon from "../images/Icon.png";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/products/${id}`,
          {
            withCredentials: true,
          }
        );
        setProduct(res.data.product);
        fetchSimilarProducts(res.data.product.tags);
        fetchReviews();
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchSimilarProducts = async (tags) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/products/similar/${id}?tags=${tags}`,
        {
          withCredentials: true,
        }
      );
      setSimilarProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/products/${id}/reviews`,
        {
          withCredentials: true,
        }
      );
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:4000/add_to_cart",
        { product_id: id },
        { withCredentials: true }
      );
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.status === 401) {
        alert("Please login first!");
      } else {
        alert("Failed to add to cart");
      }
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post(
        "http://localhost:4000/add_to_wishlist",
        { product_id: id },
        { withCredentials: true }
      );
      alert("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response && error.response.status === 401) {
        alert("Please login first!");
      } else {   
        alert("Failed to add to wishlist");
      }
    }
  };


  const productId = parseInt(id); // optional extra safety

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:4000/api/v1/products/${productId}/reviews`,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        },
        { withCredentials: true }
      );
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response && error.response.status === 401) {
        alert("Please login first!");
      } else {
        alert("Failed to submit review");
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (!product) return <div className="loading">Loading...</div>;

  // Mock multiple images - in reality, these would come from your database
  const productImages = [
    product.image_url,
    product.image_url, // You can replace these with actual multiple image URLs
    product.image_url,
    product.image_url,
  ];

  return (
    <div className="product-details-page">
      <div className="websiteHeader">
        <img className="iconImage" src={icon} alt="Site Icon" />
        <span id="websiteName">DIGITAL BAZAAR</span>
      </div>
      <br />
      <br />
      <div className="product-details-container">
        {/* Image Section */}
        <div className="product-images-section">
          <div className="main-image-container">
            <img
              src={`/${productImages[selectedImage]}`}
              alt={product.product_name}
              className="details-img"
            />
          </div>
          <div className="thumbnail-images">
            {productImages.map((image, index) => (
              <img
                key={index}
                src={`/${image}`}
                alt={`${product.product_name} ${index + 1}`}
                className={`thumbnail ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="details-info">
          <h1 className="product-title">{product.product_name}</h1>

          <div className="rating-section">
            <div className="stars">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <span className="rating-text">
              {getAverageRating()} ({reviews.length} reviews)
            </span>
          </div>

          <div className="price-section">
            <div className="price-row">
              <span className="selling-price">৳{product.selling_price}</span>
              <span className="original-price">৳{product.actual_price}</span>
              <span className="discount-badge">-৳{product.discount}</span>
            </div>
          </div>

          <div className="product-info-grid">
            <div className="info-item">
              <span className="info-label">Stock:</span>
              <span
                className={`stock-status ${
                  product.stock > 0 ? "in-stock" : "out-stock"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Tags:</span>
              <div className="tags">
                {product.tags.split(",").map((tag, index) => (
                  <span key={index} className="tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p className="short-description">{product.short_des}</p>
            <div className="full-description">
              <p>{product.product_details}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="add-to-cart-btn primary-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              className="wishlist-btn secondary-btn"
              onClick={handleAddToWishlist}
            >
              <span className="heart-icon">♡</span> Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <button
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Rating:</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${
                      star <= newReview.rating ? "active" : ""
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Comment:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <div className="reviewer-name">
                    {review.customer_name || "Anonymous"}
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="review-comment">{review.description}</p>
                <div className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="similar-products-section">
        <h2 className="section-title">Similar Products</h2>
        <div className="products-row">
          {similarProducts.map((similarProduct) => (
            <div
              key={similarProduct.id}
              className="product-card"
              onClick={() => navigate(`/product/${similarProduct.id}`)}
            >
              <img
                src={`/${similarProduct.image_url}`}
                alt={similarProduct.product_name}
                className="product-img"
              />
              <h3 className="product-name">{similarProduct.product_name}</h3>
              <div className="product-price">
                <span className="product-actual-price">
                  ৳{similarProduct.selling_price}
                </span>
                <s>৳{similarProduct.actual_price}</s>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="back-section">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
