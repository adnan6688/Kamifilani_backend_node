import { Router } from "express";
import { bannerController } from "./banner.controller";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";
// import { uploadImageS3 } from "../../utils/S3/handleImage";
import { upload } from "../../config/multer.config";


const route = Router()

route.post('/bannar-create', checkAuth, upload.single("file"), bannerController.bannerCreate)


route.get('/bannar-get', checkAuth, bannerController.getBannars)
route.delete('/delete-bannar/:bannarId', checkAuth, isAdmin, bannerController.deleteBannar)


route.get('/recenAddedBannar', checkAuth, isAdmin, bannerController.recenAddedBannar)
route.get('/adminBannars', checkAuth, isAdmin, bannerController.adminBannars)

route.get('/bannar-actions' , checkAuth , bannerController.updateBannerStats)




export const BannarRoute = route