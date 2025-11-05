import { Router } from "express";
import { fetchAllMessages, fetchMessages, sendMessage } from "../controllers/message.controller.js";
import { verifyAuth } from "../middlewares/auth.js";
import { uploader } from "../middlewares/multer.js";

const router = Router();

router.post('/',verifyAuth,uploader.single('media'),sendMessage);
router.get('/all',verifyAuth,fetchAllMessages);
router.get('/:chatId',verifyAuth,fetchMessages);


export default router;