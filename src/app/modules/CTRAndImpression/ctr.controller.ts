import { NextFunction, Request, Response } from "express";
import { ctrService } from "./ctr.service";
import { ctrType, TAction } from "./cts.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import statusCode from 'http-status-codes'
import AppError from "../../ErrorHelper/AppError";
import { Bannar } from "../Banners/banner.model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ctr = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { newsId, bannarsId } = req.body

    if (!newsId && !bannarsId) {
        throw new AppError(statusCode.BAD_REQUEST, "NewsId or BannarId must be include!")
    }

    const type = req.params.type as ctrType
    const action = req.params.action as TAction
    req.body.type = type
    const user = req.user?.id
    req.body.user = user



    if (bannarsId) {
        const ckBannars = await Bannar.findById(bannarsId)
        if (!ckBannars) {
            throw new AppError(statusCode.NOT_FOUND, 'This bannar not found!')
        }
        if ((bannarsId && type === 'NEWS')) {

            throw new AppError(statusCode.BAD_REQUEST, 'Invalid payload: bannarsId is not allowed when type is NEWS');
        }
    }

    if (newsId && type === 'BANNAR') {
        throw new AppError(statusCode.BAD_REQUEST, 'newsId is not allowed when type is BANNAR');
    }


    const result = await ctrService.ctr(req.body, action);


    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "CTR updated successfully",
        data: result,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCTRAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    
    const data = await ctrService.getCTRAnalytics()


    sendResponse(res, {
        success: true,
        message: 'CTR OF ALL',
        data,
        statusCode: statusCode.OK
    })
})

export const ctrController = {
    ctr, getCTRAnalytics
}