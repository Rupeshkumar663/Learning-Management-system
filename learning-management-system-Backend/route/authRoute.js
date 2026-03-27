import express from "express"
import { googleAuth, login, logOut, resetpassword, sendOTP, signUp, verifyOTP } from "../controller/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.post("/logout", logOut) 
authRouter.post("/sendotp",sendOTP) 
authRouter.post("/verifiedotp",verifyOTP)
authRouter.post("/resetpassword",resetpassword)
authRouter.post("/googleauth",googleAuth)


export default authRouter
