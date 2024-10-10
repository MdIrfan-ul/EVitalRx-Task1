import { checkoutOrder, fetchOrders, newOrder } from "../../models/orders/order.model.js";

// placing order
export const placeOrder  = async(req,res)=>{
    try {
        const userId = req.userId;
        const order = await newOrder(userId);
        const {orderId} = order;
        res.status(201).json({success:true,message:"Order Placed Successfully",orderId});
    } catch (error) {
        res.status(400).json({success:false,message:"Failed to place order",error:error.message});
    }
}

// fetching orders
export const getOrders = async(req,res) =>{
    try {
        const userId = req.userId;
        const order = await fetchOrders(userId);
        res.status(200).json({success:true,message:"Orders fetched successfully",order});
    } catch (error) {
        res.status(400).json({success:false,message:"Failed to getOrders",error:error.message});
    }
}

// checkout orders
export const checkOut = async (req,res)=>{
    try {
        const userId = req.userId;
        const {orderId,paymentMethod} =req.body;
        const order = await checkoutOrder(orderId,userId,paymentMethod);
        res.status(200).json({order});
    } catch (error) {
        res.status(400).json({success:false,message:"Failed to Checkout",error:error.message});
    }
}