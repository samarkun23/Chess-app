import { prismaClient } from '@repo/db/client'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import JWT_SECRET from '@repo/backend-common/jwt'

dotenv.config();

const router = Router()

router.post("/signup", async (req, res) => {
    const body = req.body;
    console.log(JWT_SECRET)

    const inUserExists = await prismaClient.user.findFirst({
        where: {
            OR: [
                { email: body.email },
                { username: body.username }
            ]
        }
    })

    if (inUserExists) {
        return res.status(409).json({
            message: "This user allready exists"
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const createUser = await prismaClient.user.create({
            data: {
                email: body.email,
                username: body.username,
                password: hashedPassword
            }
        })
        console.log("User is created")

        return res.status(201).json({
            id: createUser.id,
            email: createUser.email,
            username: createUser.username
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

})

router.post("/signin", async (req, res) => {
    const body = req.body;

    let user;
    if (body.email) {
        user = await prismaClient.user.findUnique({
            where: { email: body.email }
        })
    } else if (body.username) {
        user = await prismaClient.user.findUnique({
            where: { username: body.username }
        })
    }

    if (!user) {
        return res.status(400).json({
            message: "User not exits pz first signup"
        })
    }

    try {
        const isPasswordValid = await bcrypt.compare(
            body.password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(403).json({
                message: "user did not exits"
            })
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET!);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        });

        res.json({
            message: "LOGIN SUCCESSFULLY"
        })
    } catch (error) {
        res.status(500).json({ message: "Error while singIn" })
    }
})

router.get("/validate", async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json(401).json({ message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: any };
        const user = await prismaClient.user.findFirst({
            where: { id: decoded.userId },
            select: { id: true, username: true, email: true }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ user, token });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
})

export const authRouter = router
