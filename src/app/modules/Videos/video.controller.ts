import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { videoService } from "./video.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status-codes'
import AppError from "../../ErrorHelper/AppError";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const videoUpload = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user.id as string
    if (!req.body?.videoUrl) {
        throw new AppError(httpStatus.NOT_FOUND, "VideoUrl not found!")
    }

    const data = await videoService.getYoutubeData(req.body.videoUrl, user)

    sendResponse(res, {
        data: data,
        success: true,
        message: "YouTube video data fetched successfully",
        statusCode: httpStatus.OK
    })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteVideo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const id = req.params.id as string

    const result = await videoService.deleteVideo(id)

    sendResponse(res, {
        data: result,
        message: 'Your Video has been deleted successfully!',
        statusCode: httpStatus.OK,
        success: true
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllVideos = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const data = await videoService.getAllVideos(query as Record<string, string>)

    data.meta.total = data.data.length

    sendResponse(res, {
        success: true,
        message: 'get all videos',
        statusCode: httpStatus.OK,
        data: data.data,
        meta: data.meta
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recentAddedVideo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const ans = await videoService.recentAddedVideo()

    sendResponse(res, {
        data: ans,
        message: 'Recent Added Video!',
        statusCode: httpStatus.OK,
        success: true
    })
})


export const videoController = {

    videoUpload,
    deleteVideo,
    getAllVideos,
    recentAddedVideo
}