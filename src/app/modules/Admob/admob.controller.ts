
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Admob } from "./admob.model";
import { sendResponse } from "../../utils/SendResponse";

import status from 'http-status-codes'




// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const admobSeetings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const admob = await Admob.findOne();

    if (!admob) {
        throw new Error("Admob settings not found");
    }

    admob.isOPen = !admob.isOPen;
    await admob.save();
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: `Admob is now ${admob.isOPen ? "enabled" : "disabled"}`
    })
})