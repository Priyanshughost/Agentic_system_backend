import { Router } from "express";

import {
    getUserConversationsController,
    getConversationMessagesController,
} from "./conversation.controller.js";
import { authMiddleware } from "../../middleware/auth.js";


const router = Router();

router.get(
    "/",
    authMiddleware,
    getUserConversationsController
);

router.get(
    "/:id",
    authMiddleware,
    getConversationMessagesController
);

export default router;