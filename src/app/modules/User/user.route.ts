import { Router } from "express";
import { validateRequest } from "../../Middleware/ValidateRequest";
import { userController } from "./user.controller";
import { userZodSchema } from "./user.validation";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";
import { upload } from "../../config/multer.config";




const route = Router()

route.post('/register', validateRequest(userZodSchema), userController.userCreate)

route.post('/login', userController.loginController)

route.get('/getMe', checkAuth, userController.getMe)

route.patch('/updateinformation', checkAuth, upload.single("file"), userController.updateUserInformation)



route.get('/getUserInfo/admin', checkAuth, isAdmin, userController.adminInformationForDashboard)
route.get('/userAnylitcs', checkAuth, isAdmin, userController.userAnalytics)

route.get('/recentFiveusers/admin', checkAuth, isAdmin, userController.recentUsers)



// top users
route.get('/topUsers', checkAuth, isAdmin, userController.topusers)




// get all users
route.get('/get-all-users', checkAuth, isAdmin, userController.getAllUsersService)

route.post('/logout' , userController.logoutuser)

export const UserRoutes = route