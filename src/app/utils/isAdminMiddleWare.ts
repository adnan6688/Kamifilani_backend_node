import { NextFunction, Request, Response } from "express";
import { UserType } from "../modules/User/user.interface";



export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req)
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== UserType.ADMIN) {
            return res.status(403).json({ message: "Admin only route" });
        }

        next();
    } catch (err) {
        next(err);
    }
};