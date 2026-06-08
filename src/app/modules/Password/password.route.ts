import { Router } from "express";
import { passwordController } from "./password.controller";
import { checkAuth } from "../../config/checkAuth";




const route = Router()

route.post('/changePassword', checkAuth, passwordController.changePasswordWhenUserLogin)

route.post('/forgetPassword', passwordController.forgotPassword)
route.post('/verify-password', passwordController.verifyPassword)


route.post("/reset-password", passwordController.resetnPassword)
export const passwordRoute = route