
import { IBanner } from "./banner.interface";
import { Bannar } from "./banner.model";
import AppError from "../../ErrorHelper/AppError";
import statusCode from 'http-status-codes'
import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/QuiryBuilder";
import { deleteFromCloudinary } from "../../config/multer.config";



const bannarService = async (payLoad: Partial<IBanner>) => {
    const data = await Bannar.create(payLoad)
    return data
}



const getBannars = async () => {
    const data = await Bannar.find()
    return data || []
}


const deleteBannar = async (bannarId: Types.ObjectId) => {


    const ckBannar = await Bannar.findById(bannarId)
    if (!ckBannar) {
        throw new AppError(statusCode.NOT_FOUND, 'Bannar Not found!')
    }


    if (ckBannar.publicId) {
        await deleteFromCloudinary(ckBannar?.publicId)

    }

    await Bannar.findByIdAndDelete(bannarId);

}


const recenAddedBannar = async () => {

    const res = await Bannar.find().sort({ createdAt: -1 }).limit(3)
    return res || []
}


const adminBannar = async (query: Record<string, string>) => {


    const querybuilder = new QueryBuilder(Bannar.find(), query)

    const bannarsData = querybuilder.sort().paginate()

    const [data, meta] = await Promise.all([
        bannarsData.build(),
        bannarsData.getMeta()
    ])

    return {
        data,
        meta
    }
}




export const BannarService = {
    bannarService,
    getBannars,
    deleteBannar,
    recenAddedBannar,
    adminBannar
}