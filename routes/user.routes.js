import { Router } from "express";

import authorize from "../middlewares/auth.middleware.js";
import { getUsers, getUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

export default userRouter;