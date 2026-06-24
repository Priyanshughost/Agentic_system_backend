import { Router } from "express";

import {
    register,
    login,
    refresh,
    logout,
    me,
    sendOtp,
} from "./auth.controller.js";
import {
    authMiddleware,
} from "../../middleware/auth.js";

const router = Router();

router.post(
    "/send-otp",
    sendOtp
);

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

router.post(
    "/refresh",
    refresh
);

router.post(
    "/logout",
    authMiddleware,
    logout
);

router.get(
    "/me",
    authMiddleware,
    me
);

export default router;