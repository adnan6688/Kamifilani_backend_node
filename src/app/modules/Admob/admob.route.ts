import { Router } from "express";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";
import { admobSeetings, birthdayusers, updateMessage } from "./admob.controller";



const routes = Router()


routes.post('/update-admobs', checkAuth, isAdmin, admobSeetings)
routes.get('/birthday-info'  , checkAuth , isAdmin , birthdayusers)
routes.patch('/bithday-message/:id' , checkAuth , isAdmin , updateMessage)

export const AdmobsRoutes = routes