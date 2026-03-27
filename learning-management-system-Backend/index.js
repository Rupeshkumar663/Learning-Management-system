import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'  
import cookieParser from 'cookie-parser'
import cors from "cors"

import userRouter from "./route/userRoute.js"
import authRouter from './route/authRoute.js'
import courseRouter from './route/courseRoute.js'
import paymentRouter from './route/paymentRoute.js'
import reviewRouter from './route/reviewRoute.js'

dotenv.config()

const port = process.env.PORT || 8000
const app = express()

// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/order", paymentRouter)
app.use("/api/review",reviewRouter)
app.get("/", (req, res) => {
  res.send("Hello from server")
})

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}).catch(err => {
  console.log("DB Connection Failed:",err)
})
