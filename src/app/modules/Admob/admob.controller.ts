
import  { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Admob } from "./admob.model";
import { sendResponse } from "../../utils/SendResponse";

import status from 'http-status-codes'
import birthDayService from "./admobandBirthday.service";




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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const birthdayusers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = await birthDayService()

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        data: { ...data },
        message: `birthday informations`
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { message } = req.body;

    const updatedData = await Admob.findByIdAndUpdate(
      id,
      { $set: { birthDay: message } },
      { returnDocument: 'after' }
    );

    if (!updatedData) {
      return next(new Error("Data not found"));
    }

    sendResponse(res, {
      message: "Birthday message updated successfully",
      success: true,
      statusCode: status.OK,
      data: updatedData,
    });
  }
);