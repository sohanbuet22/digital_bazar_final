const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();


const db = require("./db");
const { message } = require("statuses");

app.use(cors());
app.use(express.json());

app.get("/api/v1/restaurants", async (req, res) => {

  try {
    const results = await db.query("select * from customer");
    res.json({
      status: "success",
      restaurant: results.rows,
    });
  } catch (err) {
    console.log(err);
  }

});

app.get("/api/v1/products", async (req, res) => {

  try {
    const results = await db.query("SELECT * FROM product p JOIN sell s ON p.product_id = s.product_id JOIN image i ON p.product_id = i.product_id;");
    res.json({
      status: "success",
      products: results.rows,
    });
    //console.log(results);
  } catch (err) {
    console.log(err);
  }

});

app.get("/api/v1/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM product p JOIN sell s ON p.product_id = s.product_id JOIN image i ON p.product_id = i.product_id WHERE p.product_id = $1",
      [id]
    );

    res.status(200).json({ product: result.rows[0] });
    console.log( result.rows[0] );
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Error fetching product" });
  }
});


app.get("/cartItems/:id", async (req, res) => {
  try {
    const customer_id = req.params.id;
    console.log(customer_id);
    const cartResult=await db.query(
      "select cart_id from customer where customer_id=$1",
      [customer_id]
    );
    if(cartResult.rows.length==0){
      return res.status(400).json({message: "Cart not found for this customer"});
    }
    const cart_id=cartResult.rows[0].cart_id;

    const results = await db.query(
      "SELECT * FROM product p join sell s on(p.product_id=s.product_id) WHERE p.product_id IN (SELECT product_id FROM cart_item WHERE cart_id = $1)",
      [cart_id]
    );

  
    res.json({
      status: "success",
      items: results.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.get("/api/v1/paymentMethods", async (req, res) => {
  try {

    const results = await db.query(
      "select payment_method from payment_method"
    );

    res.json({
      status: "success",
      methods: results.rows,
    });
    console.log(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM customer WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ customer: result.rows[0] });
      console.log("Login successful:", result.rows[0].customer_id);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//add product to cart
app.post("/add_to_cart", async (req, res) => {
  const { product_id, customer_id } = req.body;
  console.log(customer_id);
  try {
    const cartResult=await db.query(
      "select cart_id from customer where customer_id=$1",
      [customer_id]
    );
    if(cartResult.rows.length==0){
      return res.status(400).json({message: "Cart not found for this customer"});
    }
    const cart_id=cartResult.rows[0].cart_id;

    await db.query(
      "insert into cart_item(product_id,cart_id) values($1,$2)",
      [product_id,cart_id]
    );
    res.status(200).json({message:"Added to cart"});
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

app.post("/orderItems", async (req, res) => {

});


app.post("/register", async (req, res) => {
  try {
    const { email, customer_name, password, city, region, detail_address, phone_number } = req.body;

    // Ensure all fields are provided
    if (!email || !customer_name || !password || !city || !region || !detail_address || !phone_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert customer into database
    const newCustomer = await db.query(
      "INSERT INTO customer (email, customer_name, password, city, region, detail_address, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [email, customer_name, password, city, region, detail_address, phone_number]
    );

    res.status(201).json({ message: "Customer registered successfully", customer: newCustomer.rows[0] });
  } catch (err) {
    console.error("Error registering customer:", err);
    res.status(500).json({ message: "Server error" });
  }
});






const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
});


