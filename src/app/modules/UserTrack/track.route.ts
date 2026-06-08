import { Router } from "express";
import { trackController } from "./track.controller";
import { checkAuth } from "../../config/checkAuth";



const route = Router()


route.post('/click/:action/:slug', checkAuth, trackController.clickAndViews)

route.get('/foryou' , checkAuth , trackController.getForYouNews)

export const TrackRoute = route