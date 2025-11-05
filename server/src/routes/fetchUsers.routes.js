import { Router } from "express";
import { fetchUsers } from "../controllers/fetchUsers.controller.js";
import { verifyAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/all',verifyAuth,fetchUsers);


export default router;