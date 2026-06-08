import { Router } from "express";
import { checkAuth } from "../../config/checkAuth";
import { bookmarkController } from "./bookmarks.controller";




const route  = Router()


route.post('/create-book-mark' , checkAuth , bookmarkController.createBookMark)
route.get('/all-book-marks-data' , checkAuth, bookmarkController.getBookMarkData)

export const BookRoutes = route