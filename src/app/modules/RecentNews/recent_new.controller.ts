
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/SendResponse";
import { RecentNewsService } from "./recent_news.service";
import { catchAsync } from "../../utils/catchAsync";
import statusCode from 'http-status-codes'
import { Types } from "mongoose";
import AppError from "../../ErrorHelper/AppError";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllRecentNews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const page = Number(req?.query?.page as string)
  const per_page = Number(req?.query?.per_page as string)
  const search = req?.query?.search as string

  const categorySlug = req?.query?.categorySlug as string;
  const user = req.user.id as Types.ObjectId


  const data = await RecentNewsService.getAllRecentNewsService(per_page, page, search, categorySlug, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: data,
    message: "All News",

  })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewsDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const postId = Number(req?.params?.postId)
  const data = await RecentNewsService.getNewsDetailsService(postId)

  sendResponse(res, {
    data: data,
    message: 'Details of news',
    success: true,
    statusCode: statusCode.OK
  })

})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkBreakingNewsIntoDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const data = await RecentNewsService.checkBreakingNewsIntoDB()

  sendResponse(res, {
    success: true,
    data: data,
    message: 'Get All Breaking News',
    statusCode: statusCode.OK
  })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adminNewsService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const query = req.query

  const result = await RecentNewsService.adminNewsService(query as Record<string, string>)


  sendResponse(res, {
    success: true,
    message: 'Admin All news',
    data: result,
    statusCode: statusCode.OK
  })


})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleBreakingNewsStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const newsId = req.query.newsId as string
  if (!newsId) {
    throw new AppError(statusCode.NOT_FOUND, 'News Id not found!')
  }

  const msg = await RecentNewsService.toggleBreakingNewsStatus(newsId)

  sendResponse(res, {
    statusCode: statusCode.OK,
    message: msg,
    success: true
  })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const customWiseBreakingNewsAdd = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const newsId = Number(req.query.newsId) as number

  if (!newsId) {
    throw new AppError(statusCode.NOT_FOUND, 'News Id not found!')
  }

  const msg = await RecentNewsService.customWiseBreakingNewsAdd(newsId)

  sendResponse(res, {
    statusCode: statusCode.OK,
    message: msg,
    success: true
  })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allBreakingNews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const query = req.query

  const data = await RecentNewsService.allBreakingNews(query as Record<string, any>)

  sendResponse(res, {
    statusCode: statusCode.OK,
    message: 'All featured news',
    success: true,
    data
  })
})


export const RecentNewsController = {
  getAllRecentNews,
  getNewsDetails,
  checkBreakingNewsIntoDB,
  adminNewsService,
  toggleBreakingNewsStatus,
  customWiseBreakingNewsAdd,
  allBreakingNews
}