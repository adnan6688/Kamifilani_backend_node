import { Types } from "mongoose";
import { User } from "../User/user.model";
import AppError from "../../ErrorHelper/AppError";
import httpStatus from 'http-status-codes'
import { envVars } from "../../config/env";
import bcrypt from "bcryptjs";








const changePasswordWhenUserisLog = async (currentPassword: string, newPass: string, userId: Types.ObjectId) => {

    const ckUser = await User.findById(userId)
    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }

    const ckPass = await bcrypt.compare(currentPassword, ckUser.password as string)

    if (!ckPass) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current Password Doesn't match!")
    }
    const hashPass = await bcrypt.hash(newPass, Number(envVars.PASSWORD_HASH_SALT))
    ckUser.password = hashPass
    ckUser.save()
    return true
}






export const pesswordService = {
    changePasswordWhenUserisLog
}