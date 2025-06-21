import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/cart.css";

const CartProducts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/cartItems/${customerId}`);

        // Set default quantity 1 for each item (if not present)
        const itemsWithQuantity = res.data.items.map(item => ({
          ...item,
          quantity: 1,
        }));

        setCartItems(itemsWithQuantity);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (customerId) {
      fetchCartItems();
    }
  }, [customerId]);

  // Calculate grand total whenever cartItems or their quantities change
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.selling_price * item.quantity,
      0
    );
    setGrandTotal(total);
  }, [cartItems]);

  const handleQuantityChange = (productId, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete("http://localhost:4000/api/v1/cart/delete", {
        data: { product_id: productId, customer_id: customerId },
      });
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">CART ITEMS</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price (৳)</th>
                <th>Quantity</th>
                <th>Total (৳)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>{item.selling_price}</td>
                  <td>
                    <button onClick={() => handleQuantityChange(item.product_id, -1)}>-</button>
                    <span className="qty">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product_id, 1)}>+</button>
                  </td>
                  <td>{item.selling_price * item.quantity}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.product_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Grand Total: ৳{grandTotal}</h3>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartProducts;
