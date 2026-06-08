import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserTrackSerive } from "./track.service";
import { ActionType } from "./track.interface";
import { sendResponse } from "../../utils/SendResponse";
import statusCode from 'http-status-codes'
import { Types } from "mongoose";
import AppError from "../../ErrorHelper/AppError";
import { Category } from "../Categories/categori.model";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clickAndViews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const params = req.params
    const action = params.action
    const slug = params.slug
    const userId = req.user.id

  
    const ckSlug = await Category.findOne({ slug })
    if (!ckSlug) {
        throw new AppError(statusCode.NOT_FOUND, 'This category Not found!')
    }
    
    await UserTrackSerive.clickAndViews(userId as Types.ObjectId, slug as string, action as ActionType)


    sendResponse(res, {
        success: true,
        message: 'click or views done!',
        statusCode: statusCode.OK
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getForYouNews = catchAsync(async (req : Request , res : Response , next : NextFunction)=>{
    

    const userId = req.user.id 
    const query = req.query

    const data = await UserTrackSerive.getForYouNews(userId as Types.ObjectId , query as Record<string,string>)

    sendResponse(res , {
        success : true,
        message : 'For you Data',
        data : data,
        statusCode : statusCode.OK
    })
})



export const trackController = {
    clickAndViews,
    getForYouNews
}