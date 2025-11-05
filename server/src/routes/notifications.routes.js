import express from "express";
import { deleteReadNotifications, fetchAllNotifications, saveNotification } from "../controllers/notification.controller.js";
import { verifyAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get('/',verifyAuth,fetchAllNotifications);
router.post('/save',saveNotification);
router.delete('/delete',verifyAuth,deleteReadNotifications);

export default router;