import { Router } from "express";
import { authRouter } from "../auth/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();

router.use("/auth", authRouter)
router.use("/me", authMiddleware, (req,res) => {
    //@ts-ignore
    res.json({ userId: req.userId })
})

export const mainRouter = router