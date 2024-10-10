import "./env.js";
import express from "express";
import { connectDB } from "./src/config/db.config.js";
import AuthRoutes from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import ApplicationError from "./src/errorhandlers/application.errorhandler.js";
import ProductRoutes from "./src/routes/product.route.js";
import Auth from "./src/middlewares/jwt.middleware.js";
import CartRoutes from "./src/routes/cart.route.js";
import OrderRoutes from "./src/routes/order.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.json("server Started");
});

// AuthRoutes
app.use("/api/user", AuthRoutes);

// Product Routes
app.use("/api/products", Auth, ProductRoutes);

// Cart Routes
app.use("/api/carts", Auth, CartRoutes);

// Order Routes
app.use("/api/orders", Auth, OrderRoutes);


// Info about API
app.use((req, res) => {
  res.status(404)
    .send(`
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center">
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; width: 300px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center;">
        <h2 style="margin-bottom: 10px; color: #333;">OOPS! API NOT FOUND</h2>
        <p style="margin-bottom: 20px; color: #555;">To know more, visit Postman</p>
        <a href='https://documenter.getpostman.com/view/33021592/2sAXxQfYK6' target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Link</a>
        </div>
        </div>
`);
});
// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  // Server Error
  res.status(500).send("Something Went Wrong Please Try Again Later");
});

app.listen(process.env.PORT, async (req, res) => {
  console.log(`http://localhost:${process.env.PORT}`);
  connectDB();
});
