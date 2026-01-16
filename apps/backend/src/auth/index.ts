import {prismaClient} from '@repo/db/client'
import { json, Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

router.post("/signup", async(req,res) => {
    const body = req.body;

    const inUserExists = await prismaClient.user.findFirst({
        where: {
            OR:[
                {email: body.email},
                {username: body.username}
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
            data:{
                email: body.email,
                username : body.username,
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

router.post("/singin", async(req,res) => {
    const body = req.body;

    const user = await prismaClient.user.findFirst({
        where: {
            OR:[
                {email: body.email},
                {username: body.username}
            ]
        }
    })

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

        const token = jwt.sign({ id: user.id}, JWT_SECRET || "jwt-secret");

        res.json({
            token: token
        })
    } catch (error) {
        res.status(500).json({message: "Error while singIn"}) 
    }
})