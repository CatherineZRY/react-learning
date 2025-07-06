import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessageToUser, getUsersForSideBar, getMessagesByUserId } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/users', protectRoute, getUsersForSideBar);

router.get('/:userId', protectRoute, getMessagesByUserId);

router.post('/send/:userId', protectRoute, sendMessageToUser);

export default router;
