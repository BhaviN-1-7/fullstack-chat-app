import express from "express";

import { getUsersForSidebar } from "../controllers/message.conroller.js";
import { getMessages } from "../controllers/message.conroller.js";
import { sendMessage } from "../controllers/message.conroller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.get("/users",protectRoute,getUsersForSidebar);//fetching users from db,this is a static route,the resource we want doestnt change

router.get("/:id",protectRoute,getMessages);//this is dynamic route,the resource we want changes(userid)

router.post("/send/:id",protectRoute,sendMessage);

export default router;