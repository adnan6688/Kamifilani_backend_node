import { Router } from "express";
import { checkAuth } from "../../config/checkAuth";
import { isAdmin } from "../../utils/isAdminMiddleWare";
import { sendNotificationController } from "./notification.controller";
import { upload } from "../../config/multer.config";


const router = Router()


router.post('/sendnotifiication', checkAuth, isAdmin, upload.single('file'), sendNotificationController.sendNotification)

router.get('/all-notifications', checkAuth, isAdmin, sendNotificationController.getAllNotifications)

router.delete('/deleteNotifications/:notificationId', checkAuth, isAdmin, sendNotificationController.deleteNotifications)

export const NotificationRoutes = router