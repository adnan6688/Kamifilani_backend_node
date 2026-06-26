import AppError from "../../ErrorHelper/AppError";
import { IUser, UserType } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Types } from "mongoose";
import { News } from "../RecentNews/news.model";
import { BreakingNews } from "../RecentNews/recent.interface";
import { CTRIMPRESSION } from "../CTRAndImpression/ctr.model";
import { PipelineStage } from 'mongoose';
import cron from 'node-cron'
import { sendSingleNotification } from "../../utils/Notification/notification";
import { InstallEnum, installUninstallService } from "../InstallUninstall/installUninstall.service";
import { Admob } from "../Admob/admob.model";


// user registration service
const userCreated = async (payload: Partial<IUser>) => {


    const { email, password } = payload


    const ckUser = await User.findOne({ email })

    // ck user from db
    if (ckUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This user already exits!')
    }

    // hash password
    const hassPass = await bcrypt.hash(password as string, Number(envVars.PASSWORD_HASH_SALT))
    payload.password = hassPass
    payload.isAnonymous = false
    payload.deviceId = null

    const user = await User.create(payload)


    return user
}




const loginUser = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Email and password are required"
        );
    }

    const ckUser = await User.findOne({ email });

    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
    }

    const compare = await bcrypt.compare(
        password as string,
        ckUser.password as string
    );

    if (!compare) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password does not match!");
    }

    return ckUser;
};


const getMe = async (userId: Types.ObjectId) => {

    const ckUser = await User.findById(userId).select("-password");
    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }
    if (ckUser.role == UserType.GUEST) {
        ckUser.name = 'Anonymous User'
    }
    const ckAdmob = await Admob.find()

    return { ...ckUser.toObject(), admob: ckAdmob[0].isOPen ? true : false }
}


const updateUserInformation = async (userId: Types.ObjectId, info: Partial<IUser>) => {
    const ckUser = await User.findById(userId);

    if (!ckUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // Only admin can change role
    if (info.role && ckUser.role !== UserType.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Only admin can change role!');
    }

    // Nobody can change these
    if (info.email || info.password || info.isDelete === true) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You cannot change email, password, or delete status!'
        );
    }

    const result = await User.findByIdAndUpdate(userId, info, {
        returnDocument: 'after',
        runValidators: true,
    });

    return result;
};



const countOfUserRoleWise = async () => {


    const totalUser = (await User.find({ role: { $ne: UserType.ADMIN } })).length
    const GUESTUser = (await User.find({ role: UserType.GUEST })).length
    const authencticateUser = (await User.find({ role: UserType.USER })).length

    const totalNews = (await News.find()).length


    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const todayBreakingNews = await BreakingNews.find({
        createdAt: { $gte: today }, isBreaking: true
    });


    const count = todayBreakingNews.length;


    return {
        totalNews,
        GUESTUser,
        authencticateUser,
        totalUser,
        todayBreakingNews: count
    }

}



const getMonthlyUserStats = async (year: number) => {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);

    const data = await User.aggregate([
        {
            $match: {
                role: { $ne: UserType.ADMIN },
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalUsers: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);



    return data;
};


const recentUsers = async () => {
    const users = await User.find()
        .sort({ createdAt: -1 }).select('-password -breakingNewsNotification -birthDayNotification -deviceId -updatedAt -fcmToken')
        .limit(6);

    return users;
};



const topusers = async () => {

    const pipeline: PipelineStage[] = [
        {
            $group: {
                _id: "$user",
                clicks: { $sum: "$clicks" },
                impressions: { $sum: "$impressions" }
            }
        },
        {
            $addFields: {
                total: { $add: ["$clicks", "$impressions"] }
            }
        },
        { $sort: { total: -1 } },
        { $limit: 8 },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                clicks: 1,
                impressions: 1,
                total: 1,
                "userDetails._id": 1,
                "userDetails.name": 1,
                "userDetails.email": 1,
                "userDetails.deviceId": 1,
                "userDetails.role": 1,
                "userDetails.image": 1
            }
        }
    ];
    const result = await CTRIMPRESSION.aggregate(pipeline);

    return result;

};





const getAllUsersService = async (page: number = 1, limit: number = 10, search?: string, role?: "USER" | "GUEST") => {

    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [];


    const matchStage: any = {};

    if (role) {
        matchStage.role = role;
    }


    matchStage.isDelete = false;

    matchStage.email = {
        $ne: envVars.ADMIN_EMAIL
    };

    if (search) {
        matchStage.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({
            $match: matchStage
        });
    }


    pipeline.push({
        $lookup: {
            from: "ctrimpressions",
            localField: "_id",
            foreignField: "user",
            as: "stats"
        }
    });

    pipeline.push({
        $addFields: {
            clicks: { $sum: "$stats.clicks" },
            impressions: { $sum: "$stats.impressions" }
        }
    });

    pipeline.push({
        $addFields: {
            total: { $add: ["$clicks", "$impressions"] }
        }
    });

    pipeline.push({
        $project: {
            stats: 0,
            password: 0,
            deviceId: 0,
            fcmToken: 0,
            birthDayNotification: 0,
            updatedAt: 0,
            createdAt: 0,
            breakingNewsNotification: 0
        }
    });

    pipeline.push({
        $lookup: {
            from: "installuninstalls",
            localField: "_id",
            foreignField: "userId",
            as: "installData"
        }
    });

    pipeline.push({
        $addFields: {
            installCount: {
                $ifNull: [
                    { $arrayElemAt: ["$installData.installCount", 0] },
                    0
                ]
            },
            uninstallCount: {
                $ifNull: [
                    { $arrayElemAt: ["$installData.uninstallCount", 0] },
                    0
                ]
            }
        }
    });


    pipeline.push({ $sort: { total: -1 } });


    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });


    pipeline.push({
        $project: {
            stats: 0,
            installData: 0,
            password: 0
        }
    });

    const data = await User.aggregate(pipeline);


    const totalUsers = await User.countDocuments(matchStage);

    const totalpage = Math.ceil(totalUsers / limit);

    return {
        success: true,
        page,
        limit,
        totalUsers,
        totalpage,
        data
    };
};





// */1 * * * * 1min por por
// 0 7 * * * sokal 7ta africa time
cron.schedule('0 7 * * *', async () => {

    const users = await User.find({ fcmToken: { $nin: [null, ""] }, birth_date: { $ne: null }, birthDayNotification: true }).limit(100)
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentDate = today.getDate()

    const bithdayMessage = await Admob.find()
    const message = bithdayMessage[0].birthDay || ''

    try {

        for (const user of users) {
            if (!user.birth_date) continue;
            const birthDate = new Date(user.birth_date)

            const birthMonth = birthDate.getMonth() + 1
            const birthDay = birthDate.getDate()

            if (birthMonth === currentMonth && birthDay === currentDate) {

                if (user.fcmToken && user?.image) {
                    const ans = await sendSingleNotification(user.fcmToken, "🎉 Happy Birthday!", `🎉 Happy Birthday ${user.name} ❤️ ${message}`, user.image)
                    if (!ans.success) {
                        await installUninstallService.installUninstallCreateUpdate(user?._id, InstallEnum.UNINSTALL)

                    }
                }
                if (user.fcmToken && !user?.image) {
                    const ans = await sendSingleNotification(user.fcmToken, "🎉 Happy Birthday!", `🎉 Happy Birthday ${user.name} ❤️ ${message}`)
                    if (!ans.success) {
                        await installUninstallService.installUninstallCreateUpdate(user?._id, InstallEnum.UNINSTALL)
                    }

                }
            }
        }

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
    }


}, {
    timezone: "Africa/Lagos"
})




export const UserSerivce = {
    userCreated,
    loginUser,
    getMe,
    updateUserInformation,
    countOfUserRoleWise,
    getMonthlyUserStats,
    recentUsers,
    topusers,
    getAllUsersService
}