import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./auth.model.js";

import {
    generateAccessToken,
    generateAuthPayload,
    generateRefreshToken,
} from "./auth.utils.js";

export const registerUser = async ({
    name,
    email,
    password,
}) => {

    const existingUser =
        await User.findOne({
            email,
        });

    if (existingUser) {
        throw new Error(
            "User already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

    const user =
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

    return generateAuthPayload(user);
};

export const loginUser = async ({
    email,
    password,
}) => {

    const user =
        await User.findOne({
            email,
        });

    if (!user) {
        throw new Error(
            "Invalid credentials"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new Error(
            "Invalid credentials"
        );
    }

    return generateAuthPayload(user);
};
export const refreshAccessToken =
    async (refreshToken) => {

        if (!refreshToken) {
            throw new Error(
                "Refresh token required"
            );
        }

        const decoded =
            jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

        const user =
            await User.findById(
                decoded.userId
            );

        if (!user) {
            throw new Error(
                "User not found"
            );
        }

        if (
            user.refreshToken !==
            refreshToken
        ) {
            throw new Error(
                "Invalid refresh token"
            );
        }

        const accessToken =
            generateAccessToken(
                user._id
            );

        return {
            accessToken,
        };
    };
export const logoutUser =
    async (userId) => {

        await User.findByIdAndUpdate(
            userId,
            {
                refreshToken: null,
            }
        );

        return {
            message:
                "Logged out successfully",
        };
    };
export const getCurrentUser =
    async (userId) => {

        const user =
            await User.findById(userId)
                .select("-password -refreshToken");

        if (!user) {
            throw new Error(
                "User not found"
            );
        }

        return user;
    };