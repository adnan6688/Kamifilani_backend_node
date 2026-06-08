import { Router } from "express";
import { checkAuth } from "../../config/checkAuth";
import { installUinstallController } from "./installUninstall.controller";




const route  = Router()

route.post('/installOrUninstall/:type' , checkAuth , installUinstallController.installUninstallCreateUpdate)


export const installUninstaRoute = route