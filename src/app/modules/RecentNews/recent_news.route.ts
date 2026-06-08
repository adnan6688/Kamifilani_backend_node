import { Router } from "express";
import { RecentNewsController } from "./recent_new.controller";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";







const route = Router()


route.get('/all-recent-news', checkAuth, RecentNewsController.getAllRecentNews)


route.get('/details/:postId', checkAuth, RecentNewsController.getNewsDetails)
route.get('/breaking-news', checkAuth, RecentNewsController.checkBreakingNewsIntoDB)

route.get('/admin_all_news', checkAuth, isAdmin, RecentNewsController.adminNewsService)


route.patch('/change-news-status' , checkAuth , isAdmin , RecentNewsController.toggleBreakingNewsStatus)



route.patch('/latest-news-add-from-news' , checkAuth , isAdmin , RecentNewsController.customWiseBreakingNewsAdd)




route.get('/allFeaturednews' , checkAuth, isAdmin ,RecentNewsController.allBreakingNews)
export const NewsRoute = route

