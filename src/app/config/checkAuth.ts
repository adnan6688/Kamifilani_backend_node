/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { VerifiedTokenFh } from "../utils/VerifyToken";
import { envVars } from "./env";
import { User } from "../modules/User/user.model";
import { JwtPayload } from "jsonwebtoken";
import { UserType } from "../modules/User/user.interface";
import AppError from "../ErrorHelper/AppError";
import statusCode from 'http-status-codes'

const guestUserMake = async (devId: string) => {

    const ckAnnonymusUser = await User.findOne({ deviceId: devId })


    if (ckAnnonymusUser) {

        return ckAnnonymusUser
    }

    const guestUser = await User.create({
        deviceId: devId as string,
        name: "Anonymous User",
        email: `guest_${Date.now()}_${Math.random()}.temp@system.com`,
        password: "",
        role: UserType.GUEST,
        isDelete: false,
        fcmToken: "",
        birth_date: new Date(),
    });

    return guestUser;
};


export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token =
            req?.headers?.authorization?.split(" ")[1] ||
            req?.cookies?.Token || req?.headers?.authorization;



        //  NO TOKEN → CREATE GUEST USER IN DB
        if (!token) {
            const devId = req.headers['device-id']


            if (!devId) {
                throw new AppError(statusCode.BAD_REQUEST, 'Please include device ID in the request headers!');
            }

            const guestUser = await guestUserMake(devId as string);


            req.user = {
                id: guestUser._id,
                role: UserType.GUEST,
                isAnonymous: true,
            };

            return next();
        }

        // VERIFY USER
        const decoded = (await VerifiedTokenFh(
            token,
            envVars.JWT_ACCESS_SECRET
        )) as JwtPayload;

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            const devId = req.headers['device-id']


            if (!devId) {
                throw new AppError(statusCode.BAD_REQUEST, 'Please include device ID in the request headers!');
            }
            const guestUser = await guestUserMake(devId as string);


            req.user = {
                id: guestUser._id,
                role: UserType.GUEST,
                isAnonymous: true,
            };

            return next();
        }

        if (user?.isDelete) {
            throw new AppError(statusCode.BAD_REQUEST, 'User not found!')
        }
        req.user = {
            id: user._id,
            role: user.role,
            isAnonymous: false,
        };

        next();
    } catch (error) {
        const devId = req.headers['device-id']
        if (!devId) {
            throw new AppError(statusCode.BAD_REQUEST, 'Please include device ID in the request headers!');
        }
        const guestUser = await guestUserMake(devId as string);

        req.user = {
            id: guestUser._id,
            role: UserType.GUEST,
            isAnonymous: true,
        };

        next();
    }
};




