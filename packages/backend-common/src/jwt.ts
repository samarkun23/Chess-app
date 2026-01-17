import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET =  process.env.JWT_SECRET || "123456789";

export default JWT_SECRET 