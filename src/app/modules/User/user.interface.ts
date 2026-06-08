import { Types } from "mongoose";





export enum UserType {
    USER = 'USER',
    ADMIN = 'ADMIN',
    GUEST = "GUEST"
}


// interface of user
export interface IUser {
    deviceId?: string | null;
    _id?: Types.ObjectId;
    name?: string;
    password?: string;
    email?: string;

    role: UserType;
    isDelete: boolean;

    fcmToken?: string | null;

    birth_date?: Date | null;

    isAnonymous?: boolean; // key for guest tracking,

    birthDayNotification? : boolean;

    breakingNewsNotification? : boolean;

    image ? : string  | null;

    lastActiveAt : Date;
}