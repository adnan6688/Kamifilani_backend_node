import { Router } from "express";
import { ctrController } from "./ctr.controller";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";




const route = Router()

route.post('/ctrimpression/:type/:action', checkAuth, ctrController.ctr)


route.get('/get-ctr', checkAuth, isAdmin, ctrController.getCTRAnalytics)

export const CTRRoute = route