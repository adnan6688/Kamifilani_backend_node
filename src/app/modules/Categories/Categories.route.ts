import { Router } from "express";
import { CateogryController } from "./Categories.controller";
import { checkAuth } from "../../config/checkAuth";



const route = Router()


route.get('/get-all-categories', checkAuth,   CateogryController.getAllCategoreisContrller)

route.get('/search-categories/:search' , checkAuth, CateogryController.searchByCategories)



export const CategoriRoute = route