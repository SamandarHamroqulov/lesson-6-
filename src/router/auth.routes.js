const { Router } = require("express")
const authController = require("../controller/auth.controller")
const authRouter = Router()
authRouter.post("/register", authController.REGISTER)
authRouter.post("/login", authController.LOGIN)
authRouter.get("/verify/email", authController.VERIFY);
authRouter.post("/forgot/password", authController.FORGOT_PASSWORD)
authRouter.post("/reset/password", authController.RESET_PASSWORD)
authRouter.post("/resend/link", authController.RESEND_LINK)
authRouter.post("/refresh", authController.REFRESH)
module.exports = authRouter
