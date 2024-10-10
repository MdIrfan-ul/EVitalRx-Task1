import { fetchProducts } from "../../models/products/product.model.js";

export const getProduct = async(req,res) =>{
    try {
        const products = await fetchProducts();
        if(!products|| products.length===0){
            res.status(400).json({success:false,message:"No Products found"});
        }
        res.status(200).json({success:true,message:"Products fetched successfully",products})
    } catch (error) {
        res.status(400).json({success:false,message:"Failed to get",error:error.message});
    }
}