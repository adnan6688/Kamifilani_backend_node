import {  NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/SendResponse";
import { CategoryService } from "./Categories.service";
import httpStatus from 'http-status-codes'
import { catchAsync } from "../../utils/catchAsync";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllCategoreisContrller = catchAsync(async (req: Request, res: Response,next :NextFunction) => {

    const data = await CategoryService.getAllCategories()

    sendResponse(res, {
        success: true,
        data: data,
        message: 'All Categories Fetch',
        statusCode: httpStatus.OK
    })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchByCategories = async (req: Request, res: Response,next : NextFunction) => {

    const search = req?.params?.search
    const data = await CategoryService.searchByCategoriesService(search as string)

    sendResponse(res, {
        success: true,
        data: data,
        statusCode: httpStatus.OK,
        message: 'Get search by categories'
    })
}


export const CateogryController = {

    searchByCategories,
    getAllCategoreisContrller
}