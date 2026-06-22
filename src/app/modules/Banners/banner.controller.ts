import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";
import { BannarService } from "./bannar.service";
import { sendResponse } from "../../utils/SendResponse";
import statusCode from 'http-status-codes'
import mongoose from "mongoose";
import { Bannar } from "./banner.model";
import AppError from "../../ErrorHelper/AppError";


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



const updateBannerStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { type } = req.query;
    if (!id) {
        throw new AppError(400, "Banner id is required")
    }
    if (type !== "click" && type !== "impression") {
        throw new AppError(400, "type must be click or impression")
    }
    const updateField =
        type === "click"
            ? { click: 1 }
            : { impressions: 1 };
    const ckBannar = await Bannar.findById(id)
    if (!ckBannar) {
        throw new AppError(404, "Banner not found")
    }
    const banner = await Bannar.findByIdAndUpdate(
        id,
        { $inc: updateField },
        { returnDocument: 'after' }
    );
    sendResponse(res, {
        success: true,
        message: `${type} updated successfully`,
        data: banner,
        statusCode: statusCode.OK
    })
})


export const bannerController = {
    bannerCreate,
    getBannars,
    deleteBannar,
    recenAddedBannar,
    adminBannars,
    updateBannerStats
}