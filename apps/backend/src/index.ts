import express from 'express'
import cors from 'cors'
import { mainRouter } from './routers/mainroute.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json()); // <-- add JSON middleware
app.use(cookieParser())

app.use("/", mainRouter)

// start server
const PORT = 4000;
app.listen(4000, () => {
  console.log(`Backend listening on http://localhost: 4000 jaf`);
});
