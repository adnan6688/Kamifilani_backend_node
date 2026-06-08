import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../ErrorHelper/AppError";
import statusCode from 'http-status-codes'
import { BookMarkService } from "./bookmarks.service";
import { sendResponse } from "../../utils/SendResponse";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBookMark = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user.id
    const { newsId } = req.body

    if (!newsId) {
        throw new AppError(statusCode.NOT_FOUND, 'News is must be included!')

    }

    const result = await BookMarkService.createBookMark(newsId, user)

    sendResponse(res, {
        success: true,
        message: result === 'unbookmark'
            ? 'Removed from bookmarks successfully!'
            : 'Added to bookmarks successfully!',
        statusCode: statusCode.CREATED,

    })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getBookMarkData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user.id
    const query = req.query
    const data = await BookMarkService.getBookMarkData(user, query as Record<string, string>)

    sendResponse(res, {
        success: true,
        message: 'All Book Marks Data',
        data: data,
        statusCode: statusCode.OK
    })
})

export const bookmarkController = {
    createBookMark,
    getBookMarkData
}