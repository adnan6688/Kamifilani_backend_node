import { Types } from "mongoose";
import { User } from "../User/user.model";
import AppError from "../../ErrorHelper/AppError";
import statusCode from 'http-status-codes'
import { InstallUninstall } from "./installUninstall.model";


export const  enum InstallEnum {

    INSTALL = "INSTALL",
    UNINSTALL = "UNINSTALL"
}

export const installUninstallCreateUpdate = async (userId: Types.ObjectId, type: InstallEnum) => {


    const ckUser = await User.findById(userId);

    if (!ckUser) {
        throw new AppError(statusCode.NOT_FOUND, "User not found!");
    }


    const doc = await InstallUninstall.findOne({ userId });

    const isInstall = type === InstallEnum.INSTALL;

    const installCount = doc?.installCount || 0;
    const uninstallCount = doc?.uninstallCount || 0;


    if (!isInstall) {

        if (!doc) return false;

        if (uninstallCount + 1 > installCount) {
            return false;
        }
    }


    const updateField = isInstall ? "installCount" : "uninstallCount";


    const result = await InstallUninstall.findOneAndUpdate(
        { userId },
        {
            $inc: {
                [updateField]: 1,
            },
            $setOnInsert: {
                userId,
            },
        },
        {
            new: true,
            upsert: true,
        }
    );

    return {
        success: true,
        data: result,
    };
};


export const installUninstallService = {
    installUninstallCreateUpdate
}