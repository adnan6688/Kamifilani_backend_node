import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from 'express'
import { InstallEnum, installUninstallService } from "./installUninstall.service";
import { Types } from "mongoose";
import { sendResponse } from "../../utils/SendResponse";
import statusCode from 'http-status-codes'
import AppError from "../../ErrorHelper/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const installUninstallCreateUpdate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user.id as Types.ObjectId
    const type = req.params.type as InstallEnum
    if(!type){
        throw new AppError(statusCode.NOT_FOUND , "Plz give me type(UNINSTALL or INSTALL ")
    }

    await installUninstallService.installUninstallCreateUpdate(user, type)

    sendResponse(res, {
        success: true,
        message: 'Application event processed successfully.',
        statusCode: statusCode.OK
    })
})


export const installUinstallController = {
    installUninstallCreateUpdate
}