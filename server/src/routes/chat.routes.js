import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, updateGroupDetails, updateGroupProfileImage } from "../controllers/chat.controller.js";
import { uploader } from "../middlewares/multer.js";

const router = Router();

router.post('/',verifyAuth,accessChat);
router.get('/all',verifyAuth,fetchChats);
router.post('/group',verifyAuth,uploader.single('avatar'),createGroupChat);
router.put('/group/update/details',verifyAuth,uploader.single('avatar'),updateGroupDetails);
router.put('/group/adduser/new',verifyAuth,addToGroup);
router.put('/group/removeuser',verifyAuth,removeFromGroup);
router.put('/group/updateAvatar',verifyAuth,uploader.single('avatar'),updateGroupProfileImage);


export default router;