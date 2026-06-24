import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import {
    generateAccessToken,
    generateAuthPayload,
    generateRefreshToken,
} from "./auth.utils.js";
import crypto from "crypto";
import Verification from "./verification.model.js";
import { sendOtpEmail } from "./mail.js";

export const registerUser = async ({
    email,
    otp,
}) => {

    const verification =
        await Verification.findOne({
            email: email.toLowerCase(),
        });

    if (!verification) {
        throw new Error(
            "OTP expired or invalid"
        );
    }

    const otpHash =
        crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

    if (
        verification.otpHash !==
        otpHash
    ) {
        throw new Error(
            "Invalid OTP"
        );
    }

    const existingUser =
        await User.findOne({
            email,
        });

    if (existingUser) {
        throw new Error(
            "User already exists"
        );
    }

    const user =
        await User.create({
            name:
                verification.name,

            email:
                verification.email,

            password:
                verification.passwordHash,
        });

    await Verification.deleteOne({
        _id:
            verification._id,
    });

    return generateAuthPayload(
        user
    );
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
export const sendRegistrationOtp =
    async ({
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

        const otp =
            Math.floor(
                100000 +
                Math.random() *
                900000
            ).toString();

        const otpHash =
            crypto
                .createHash("sha256")
                .update(otp)
                .digest("hex");

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        await Verification.findOneAndUpdate(
            { email },
            {
                name,
                email,
                passwordHash,
                otpHash,
                expiresAt:
                    new Date(
                        Date.now() +
                        10 * 60 * 1000
                    ),
            },
            {
                upsert: true,
                new: true,
            }
        );

        await sendOtpEmail(
            email,
            otp
        );

        return {
            message:
                "OTP sent successfully",
        };
    };