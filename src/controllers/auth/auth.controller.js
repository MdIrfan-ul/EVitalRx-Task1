import bcrypt from "bcryptjs";
import { createUser, getUser } from "../../models/users/user.model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
//  validate data from the user
        const validationMessage = validateUser(name, email, password);
        if (validationMessage !== true) {
            return res.status(400).json({ success: false, message: "Failed to signup", error: validationMessage });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await createUser(name, email, hashedPassword);
        res.status(201).json({ success: true, message: "Signup successfull", newUser });

    } catch (error) {
        res.status(404).json({ success: false, message: "Failed to signup", error: error.message });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validationMessage = validateLogin(email, password);
        if (!validationMessage) {
            res.status(400).json({ success: false, message: "Failed to signup", error: validationMessage });
        }

        const validUser = await getUser(email);
        if (!validUser) {
            res.status(404).json({ success: false, message: "Invalid Email", error: "Invalid Email Credentials" });
        }
        const passwordMatch = await bcrypt.compare(password, validUser.password);
        if (!passwordMatch) {
            res.status(404).json({ success: false, message: "Wrong Password", error: "Invaild Password Credentials" });
        }
        const token = jwt.sign({ id: validUser.user_id, email: validUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: "strict" });
        res.status(200).json({ success: true, message: "Login Successfull", user: { id: validUser.userid, name: validUser.name, email: validUser.email }, token });

    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Failed to Login", error });
    }
}


export const logout = (req, res) => {
    try {
        // set token to expire
        res.cookie("jwt", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

// hashing password using bcryptjs
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const validateUser = (name, email, password) => {
    // Check if name is empty or null
    if (!name || name.trim().length === 0) {
        return 'Name is required';
    }

    // Check if email is empty or null
    if (!email || email.trim().length === 0) {
        return 'Email is required';
    }

    // Check if password is empty or null
    if (!password || password.length === 0) {
        return 'Password is required';
    }

    // Check password length (between 8 and 16 characters)
    if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters';
    }

    // Return true if all validations pass
    return true;
};


const validateLogin = (email, password) => {
    // Check if email is empty or null
    if (!email || email.trim().length === 0) {
        return 'Email is required';
    }

    // Check if password is empty or null
    if (!password || password.length === 0) {
        return 'Password is required';
    }

    // Check password length (between 8 and 16 characters)
    if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters';
    }

    // Return true if all validations pass
    return true;
};
