import express from 'express'
import cors from 'cors'
import { mainRouter } from './routers/mainroute.js';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
app.use(cors());

app.use("/", mainRouter)
