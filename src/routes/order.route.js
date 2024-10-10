import express from "express";
import { checkOut, getOrders, placeOrder } from "../controllers/orders/order.controller.js";

const OrderRoutes = express.Router();

// placeOrder
OrderRoutes.post('/',(req,res)=>{
placeOrder(req,res);
});

// getOrder
OrderRoutes.get('/',(req,res)=>{
    getOrders(req,res);
})

// checkout
OrderRoutes.post('/checkout',(req,res)=>{
    checkOut(req,res);
})

export default OrderRoutes;