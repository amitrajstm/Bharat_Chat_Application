import { Router } from "express";
import { forgotPass, GoogleSignIn, loginUser, registerUser, verifyEmailandChangePassword, verifyUserToken } from "../controllers/user.controller.js";
import { verifyAuth } from "../middlewares/auth.js";
import { uploader } from "../middlewares/multer.js";
import { deleteAvatar, updateAvatar, updateProfile } from "../controllers/userProfile.controller.js";

const router = Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/gsignin',GoogleSignIn);
router.post('/forgotpass',forgotPass);
router.post('/verifyforgotpass',verifyEmailandChangePassword);
router.get('/verifyauth',verifyUserToken);


// User Profile
router.put('/update/avatar',verifyAuth,uploader.single('avatar'),updateAvatar);
router.delete('/delete/avatar',verifyAuth,deleteAvatar);
router.put('/update/profile',verifyAuth,updateProfile);




export default router;