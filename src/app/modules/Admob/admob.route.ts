import { Router } from "express";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";
import { admobSeetings } from "./admob.controller";



const routes = Router()


routes.post('/update-admobs', checkAuth, isAdmin, admobSeetings)


export const AdmobsRoutes = routes