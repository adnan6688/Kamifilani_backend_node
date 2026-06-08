import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserSerivce } from "./user.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from 'http-status-codes'
import { createUserTokens } from "../../utils/createTokens";
import { Types } from "mongoose";
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userCreate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = await UserSerivce.userCreated(req?.body)


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Registration Successfully!',
        success: true,
        data: user
    })

});





// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email, password } = req.body


    const data = await UserSerivce.loginUser({ email, password })



    const payload = {
        email: data.email,
        id: data._id,
        role: data.role
    }

    const token = await createUserTokens(payload)
    res.cookie("Token", token.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,

    });

    sendResponse(res, {
        success: true,
        data: {
            accessToken: token.accessToken
        },
        message: 'Login Successfully!',
        statusCode: httpStatus.OK
    })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const userId = req.user.id
    const result = await UserSerivce.getMe(userId as Types.ObjectId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Personal Information!!",
        success: true,
        data: result
    })

})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUserInformation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    if (req.file) {
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({
                quality: 70,
                mozjpeg: true,
            })
            .toBuffer();


        const result: any = await uploadToCloudinary(compressedImage);

        req.body.image = result.secure_url;
        req.body.publicId = result.public_id;

    }



    const userId = req.user.id
    await UserSerivce.updateUserInformation(userId as Types.ObjectId, req.body)

    sendResponse(res, {
        success: true,
        message: 'information update successfully!',
        statusCode: httpStatus.OK
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adminInformationForDashboard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const result = await UserSerivce.countOfUserRoleWise()
    sendResponse(res, {
        success: true,
        message: 'successfully information get',
        data: result,
        statusCode: httpStatus.OK
    })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const year = Number(req.query.year) || new Date().getFullYear();


    const result = await UserSerivce.getMonthlyUserStats(year);

    // convert to graph-friendly format
    const formatted = Array.from({ length: 12 }, (_, i) => {
        const found = result.find((r) => r._id === i + 1);

        return {
            month: i + 1,
            users: found ? found.totalUsers : 0,
        };
    });


    sendResponse(res, {
        success: true,
        message: 'Get user Analytics',
        data: formatted,
        statusCode: httpStatus.OK
    })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recentUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const data = await UserSerivce.recentUsers()


    sendResponse(res, {
        data,
        message: 'Recent Five users',
        success: true,
        statusCode: httpStatus.OK
    })

})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const topusers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await UserSerivce.topusers()


    sendResponse(res, {
        success: true,
        message: 'Top Users',
        statusCode: httpStatus.OK,
        data: result || []
    })
})




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsersService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const role = req.query.role as "USER" | "GUEST" | undefined;
    const search = req.query.search as string | undefined;

    const users = await UserSerivce.getAllUsersService(page, limit, search, role);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Get All Users',
        data: users
    })

})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logoutuser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    res.clearCookie("Token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,

    });


    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
}
);

export const userController = {
    userCreate,
    loginController,
    getMe,
    updateUserInformation,
    adminInformationForDashboard,
    userAnalytics,
    recentUsers, topusers, getAllUsersService, logoutuser
}