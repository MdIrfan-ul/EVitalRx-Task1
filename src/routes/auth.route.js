import express from "express";
import { signup,login, logout } from "../controllers/auth/auth.controller.js";
import Auth from "../middlewares/jwt.middleware.js";

const AuthRoutes = express.Router();

// Signup
AuthRoutes.post('/signup',(req,res)=>{
    signup(req,res);
});

// Login
AuthRoutes.post('/login',(req,res)=>{
login(req,res);
});

// Logout
AuthRoutes.get('/logout',Auth,(req,res)=>{
    logout(req,res);
})


export default AuthRoutes;