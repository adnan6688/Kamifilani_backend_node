import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Types } from "mongoose";
import AppError from "../../ErrorHelper/AppError";
import httpStatus from 'http-status-codes'
import { pesswordService } from "./password.service";
import { sendResponse } from "../../utils/SendResponse";
import { generateOtp } from "../../utils/ForgetPassword/generateOTP";
import { redisClient } from "../../config/redis";
import { sendEmail } from "../../utils/ForgetPassword/sendOTP";
import { User } from "../User/user.model";
import bcrypt from 'bcrypt'
import { envVars } from "../../config/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changePasswordWhenUserLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user.id as Types.ObjectId
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current Password Not found!")
    }
    if (currentPassword === newPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current password and new password cannot be the same");
    }
    if (confirmPassword != newPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Password Does not match!')
    }

    await pesswordService.changePasswordWhenUserisLog(currentPassword, newPassword, userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `password update successfully!`
    })
})







// eslint-disable-next-line @typescript-eslint/no-unused-vars
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body

    const ckUser = await User.findOne({ email })
    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }

    const otp = generateOtp()

    // store in redis (5 min expiry)
    await redisClient.set(`otp:${email}`, otp, { EX: 300 })

    await sendEmail(
        email,
        "OTP Verification",
        `
        <h2>Your OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
        `
    )

    sendResponse(res, {
        success: true,
        message: 'Otp Send Successfully!',
        statusCode: httpStatus.OK
    })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verifyPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { email, otp } = req.body
    const ckUser = await User.findOne({ email })
    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }
    if (!email || !otp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields')
    }

    const storedOtp = await redisClient.get(`otp:${email}`)

    if (!storedOtp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired or not found')
    }

    if (storedOtp !== otp) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP")
    }

    // delete OTP after success
    await redisClient.del(`otp:${email}`)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified successfully"
    })
}
)


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetnPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { email, password } = req.body


    const ckUser = await User.findOne({ email })

    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }

    if (!email || !password) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields')
    }
    if (password.length < 6) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Password must be at least 6 characters')
    }

    const hashedPassword = await bcrypt.hash(password,
        Number(envVars.PASSWORD_HASH_SALT)
    )

    const updatedUser = await User.updateOne(
        { email },
        { password: hashedPassword }
    )

    if (updatedUser.modifiedCount === 0) {

        throw new AppError(httpStatus.BAD_REQUEST, "User not updated")
    }
    sendResponse(res, {
        message: 'Password reset successfully!',
        statusCode: httpStatus.OK,
        success: true
    })
})



export const passwordController = {
    changePasswordWhenUserLogin,
    forgotPassword,
    verifyPassword,
    resetnPassword
}