import express from "express";
import { getProduct } from "../controllers/products/product.controller.js";

const ProductRoutes = express.Router();

// fetch products
ProductRoutes.get('/',(req,res)=>{
    getProduct(req,res);
});


export default ProductRoutes;