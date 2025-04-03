import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

import User from '../models/user.model.js';

export const signUp = async (req, res, next) =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        console.log("Request Body:", req.body);
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        // Generate token
        const token = jwt.sign({ id: newUsers._id }, JWT_SECRET, { expiresIn: 600});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            data: {
                user: newUsers[0],
                token
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) =>{
    try {
        const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Invalid password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            user,
            token
        }
    });
    } catch (error) {
        next(error);
    }
}

/*export const signOut = async (req, res, next) =>{

}*/