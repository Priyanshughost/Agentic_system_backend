import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import {
    generateAccessToken,
    generateAuthPayload,
    generateRefreshToken
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

    if (!email || !otp) {
        throw new Error("Incomplete Details Provided")
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
            email: email.toLowerCase(),
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

        let decoded;

        try {

            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

        }
        catch (error) {

            if (error.name === "TokenExpiredError") {
                throw new Error("Refresh token expired");
            }

            throw new Error("Invalid refresh token");

        }

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
            generateAccessToken(user._id);

        const newRefreshToken =
            generateRefreshToken(user._id);

        user.refreshToken =
            newRefreshToken;

        await user.save();

        return {
            accessToken,
            refreshToken: newRefreshToken,
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

        const existingVerification =
            await Verification.findOne({
                email: email.toLowerCase(),
            });

        if (existingVerification) {

            const diff =
                Date.now() -
                existingVerification.lastOtpSentAt.getTime();

            if (diff < 60_000) {

                const seconds =
                    Math.ceil(
                        (60_000 - diff) / 1000
                    );

                throw new Error(
                    `Please wait ${seconds}s before requesting another OTP`
                );
            }
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
            {
                email: email.toLowerCase(),
            },
            {
                name,
                email: email.toLowerCase(),
                passwordHash,
                otpHash,
                expiresAt:
                    new Date(
                        Date.now() +
                        10 * 60 * 1000
                    ),
                lastOtpSentAt:
                    new Date(),
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

