import express from "express";
import { addToCart } from "../controllers/carts/cart.controller.js";

const CartRoutes = express.Router();

// addToCart
CartRoutes.post('/add',(req,res)=>{
    addToCart(req,res);
})


export default CartRoutes;