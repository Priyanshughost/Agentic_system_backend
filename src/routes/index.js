import { Router } from "express";

import chatRoutes
    from "../modules/chat/chat.routes.js";
import authRoutes
    from "../modules/auth/auth.routes.js";
import conversationRoutes
    from "../modules/conversation/conversation.routes.js";

const router = Router();

router.use("/chat", chatRoutes);
router.use("/auth", authRoutes);
router.use("/conversations", conversationRoutes);

export default router