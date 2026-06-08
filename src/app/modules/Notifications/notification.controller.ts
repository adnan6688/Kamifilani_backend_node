import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import statusCode from 'http-status-codes'
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";
import { notificationService } from "./notification.service";
import AppError from "../../ErrorHelper/AppError";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sendNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (req.file) {
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({
                quality: 70,
                mozjpeg: true,
            })
            .toBuffer();


        const result: any = await uploadToCloudinary(compressedImage);

        req.body.image = result.secure_url;
        req.body.publicId = result.public_id;

    }

    await notificationService.sendNotification(req.body)

    sendResponse(res, {
        success: true,
        message: 'Notification sent successfully!',
        statusCode: statusCode.OK
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllNotifications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    const result = await notificationService.getAllNotifications(query as Record<string, string>)

    sendResponse(res, {
        data: result.data,
        meta: result?.meta,
        success: true,
        statusCode: statusCode.OK,
        message: 'All Notification get successfully!'
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteNotifications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { notificationId } = req.params

    if (!notificationId) {
        throw new AppError(statusCode.NOT_FOUND, 'Id not found!')
    }

    const result = await notificationService.deleteNotifications(notificationId as string)

    sendResponse(res, {
        success: true,
        message: 'Notification Remove successfully!',
        statusCode: statusCode.OK,
        data: result
    })
})

export const sendNotificationController = {
    sendNotification,
    getAllNotifications,
    deleteNotifications
}