import { Types } from "mongoose";
import { News } from "../RecentNews/news.model";
import AppError from "../../ErrorHelper/AppError";
import htttpStatus from 'http-status-codes'
import { User } from "../User/user.model";
import { BookMark } from "./bookmarks.model";
import { QueryBuilder } from "../../utils/QuiryBuilder";




const createBookMark = async (newsId: Types.ObjectId, user: Types.ObjectId) => {

    const ckNewsId = await News.findById(newsId)
    if (!ckNewsId) {
        throw new AppError(htttpStatus.NOT_FOUND, 'News Not found!')
    }
    const ckUser = await User.findById(user)
    if (!ckUser) {
        throw new AppError(htttpStatus.NOT_FOUND, 'User not found!')
    }

    const ckBoookMark = await BookMark.findOne({ newsId, userId: user })
    
    if (ckBoookMark) {
        await BookMark.findOneAndDelete({ newsId })

        return 'unbookmark'
    }

    const result = await BookMark.create({ userId: user, newsId: newsId })


    return result
}


const getBookMarkData = async (userId: Types.ObjectId, query: Record<string, string>) => {

    const bookMarkQuearyBUilder = new QueryBuilder(BookMark.find({ userId }), query)

    const result = bookMarkQuearyBUilder.sort().paginate().populate([
        {
            path: `userId`,
            select: 'name'
        }, {
            path: 'newsId',
            select: 'title description image author link id'
        }
    ])


    const [data, meta] = await Promise.all([
        result.build(),
        result.getMeta()
    ])

    return {
        data, meta
    }

}


export const BookMarkService = {
    createBookMark,
    getBookMarkData
}