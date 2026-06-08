import AppError from "../../ErrorHelper/AppError";
import { sendTopicNotificationCustom } from "../../utils/Notification/notification";
import { Inotifications } from "./notification.interface";
import statusCode from 'http-status-codes'
import { Notification } from "./notification.model";
import { QueryBuilder } from "../../utils/QuiryBuilder";
import { deleteFromCloudinary } from "../../config/multer.config";


const sendNotification = async (payload: Partial<Inotifications>) => {

    const { title, headline, image, link, publicId } = payload

    if (!title || !headline || !image || !link) {
        throw new AppError(statusCode.BAD_REQUEST, 'All fields are required')
    }


    const message = await sendTopicNotificationCustom(title, image, headline, link)
    if (message?.success) {

        await Notification.create({
            title,
            headline,
            image,
            link,
            publicId
        })
    }
    return message?.success ? message?.message : 'Notification sent Failed!'
}


const getAllNotifications = async (query: Record<string, string>) => {

    const querybuilder = new QueryBuilder(Notification.find(), query)


    const notificationsData = querybuilder.filter().search(['title', 'headline']).sort().fields().paginate()


    const [data, meta] = await Promise.all([
        notificationsData.build(),
        querybuilder.getMeta()
    ])

    return {
        data, meta
    }

}


const deleteNotifications = async (notificationId: string) => {


    const ckNotificaiton = await Notification.findById(notificationId)
    if (!ckNotificaiton) {
        throw new AppError(statusCode.NOT_FOUND, 'Notification not found!')
    }

    if (ckNotificaiton.publicId) {
        await deleteFromCloudinary(ckNotificaiton?.publicId)
    }

    await Notification.deleteOne({ _id: notificationId })

    return true
}



export const notificationService = {
    sendNotification,
    getAllNotifications,
    deleteNotifications
}