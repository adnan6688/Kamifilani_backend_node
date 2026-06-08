import { Router } from "express";
import { CategoriRoute } from "../modules/Categories/Categories.route";
import { NewsRoute } from "../modules/RecentNews/recent_news.route";
import { UserRoutes } from "../modules/User/user.route";
import { BannarRoute } from "../modules/Banners/bannar.route";
import { VideoRoute } from "../modules/Videos/video.route";
import { CTRRoute } from "../modules/CTRAndImpression/ctr.route";
import { passwordRoute } from "../modules/Password/password.route";
import { TrackRoute } from "../modules/UserTrack/track.route";
import { BookRoutes } from "../modules/BookMarks/bookmarks.route";
import { installUninstaRoute } from "../modules/InstallUninstall/installUninstall.route";
import { NotificationRoutes } from "../modules/Notifications/notification.route";
import { AdmobsRoutes } from "../modules/Admob/admob.route";




export const router = Router()



const modulesRoute = [
    {
        path: '/category',
        route: CategoriRoute
    }, {
        path: '/news',
        route: NewsRoute
    },
    {
        path: '/user',
        route: UserRoutes
    }, {
        path: '/bannar',
        route: BannarRoute
    }, {
        path: '/video',
        route: VideoRoute
    }, {
        path: '/ctr',
        route: CTRRoute
    }, {
        path: '/password',
        route: passwordRoute
    }, {
        path: '/track',
        route: TrackRoute
    }, {
        path: '/bookMarks',
        route: BookRoutes
    }, {
        path: '/app-lifecycle',
        route: installUninstaRoute
    }, {
        path : '/notification' , 
        route : NotificationRoutes
    }, {
        path :'/admobs' , 
        route : AdmobsRoutes
    }
]



modulesRoute.forEach((route) => {
    router.use(route.path, route.route)
})