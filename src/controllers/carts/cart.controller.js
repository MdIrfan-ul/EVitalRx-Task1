import { addCart } from "../../models/carts/cart.model.js";

// Adding Items to cart
export const addToCart = async(req,res)=>{
    try {
        const userId = req.userId;
        const {productId,quantity} = req.body;
        if(!productId){
            res.status(404).json({success:false,message:"Product Id is required",err});
        }
        const cart =await addCart(userId,productId,quantity);
        res.status(201).json({success:true,message:"Product Added to Cart Successfully",cart});
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false,message:"Failed to add"});
    }
}