import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/productDetails.css"; // create this if you want styles

const ProductDetails = () => {
    const { id } = useParams(); // gets product_id from URL
    const [product, setProduct] = useState(null);
    const customerId = localStorage.getItem("customerId");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/v1/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async (productId) => {
        if (!customerId) {
            alert("Please login first!");
            return;
        }

        try {
            console.log(id);
            console.log(customerId);
            await axios.post("http://localhost:4000/add_to_cart", {
                product_id: id,
                customer_id: customerId,
            });
            alert("Added to cart!");
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };


    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-details-container">
            <img src={`/${product.image_url}`} alt={product.product_name} className="details-img" />
            <div className="details-info">
                <h1>{product.product_name}</h1>
                <p>{product.product_details}</p>
                <p><strong>Tags:</strong> {product.tags}</p>
                <p><strong>Description:</strong> {product.short_des}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Original Price:</strong> <s>৳{product.actual_price}</s></p>
                <p><strong>Discount:</strong> ৳{product.discount}</p>
                <p><strong>Selling Price:</strong> <b>৳{product.selling_price}</b></p>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
