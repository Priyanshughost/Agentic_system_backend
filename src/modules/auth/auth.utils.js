import jwt from "jsonwebtoken";

export const generateAccessToken = (
    userId
) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

export const generateRefreshToken = (
    userId
) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );
};
export const generateAuthPayload = async (
    user
) => {

    const accessToken =
        generateAccessToken(user._id);

    const refreshToken =
        generateRefreshToken(user._id);

    user.refreshToken =
        refreshToken;

    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    };
};