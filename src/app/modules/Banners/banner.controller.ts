import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";
import { BannarService } from "./bannar.service";
import { sendResponse } from "../../utils/SendResponse";
import statusCode from 'http-status-codes'
import mongoose from "mongoose";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bannerCreate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {




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


    const data = await BannarService.bannarService(req.body)

    sendResponse(res, {
        data: data,
        message: 'Bannar Create successfully!',
        statusCode: statusCode.CREATED,
        success: true
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getBannars = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const result = await BannarService.getBannars()

    sendResponse(res, {
        data: result,
        message: 'Gell All Bannars',
        success: true,
        statusCode: statusCode.OK
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteBannar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const bannarId = new mongoose.Types.ObjectId(req.params.bannarId as string);
    await BannarService.deleteBannar(bannarId)

    sendResponse(res, {

        
        success: true,
        message: 'Bannar Deleted!',
        statusCode: statusCode.OK
    })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recenAddedBannar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await BannarService.recenAddedBannar()

    sendResponse(res, {
        success: true,
        message: 'Recent Added Bannar',
        data: result,
        statusCode: statusCode.OK
    })
})



// admin bannar
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adminBannars = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req.query

    const data = await BannarService.adminBannar(query as Record<string, string>)


    sendResponse(res, {
        data: data,
        success: true,
        statusCode: statusCode.OK,
        message: 'All Bannars get successfully!',
    })
})

export const bannerController = {
    bannerCreate,
    getBannars,
    deleteBannar,
    recenAddedBannar,
    adminBannars
}