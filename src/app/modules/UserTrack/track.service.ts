import { Types } from "mongoose";
import { UserTrack } from "./track.model";
import { ActionType } from "./track.interface";

import { News } from "../RecentNews/news.model";


export const clickAndViews = async (
    userId: Types.ObjectId,
    categorySlug: string,
    action: ActionType
) => {
    const slug = categorySlug.toLowerCase();

    const update: any = {};

    if (action === ActionType.CLICK) {
        update.$inc = { Clicks: 1 };
    }

    const result = await UserTrack.findOneAndUpdate(
        { userId, categorySlug: slug },
        update,
        {
            upsert: true,
            returnDocument: 'after',
            setDefaultsOnInsert: true,
        }
    );

    return result;
};




export const getForYouNews = async (userId: Types.ObjectId, query: Record<string, any>) => {

    // 1. get user clicks
    const tracks = await UserTrack.find({ userId }).sort({ Clicks: -1 });

    const slugs = tracks.map(t => t.categorySlug.toLowerCase());

    if (!slugs.length) {
        return {
            data: [],
            meta: { total: 0 },
        };
    }

    // 2. pagination
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    // 3. MAIN FIX (safe match)
    const data = await News.aggregate([
        {
            $match: {
                categorySlugs: {
                    $in: slugs
                }
            }
        },

        {
            $addFields: {
                weight: {
                    $size: {
                        $filter: {
                            input: "$categorySlugs",
                            as: "c",
                            cond: { $in: ["$$c", slugs] }
                        }
                    }
                }
            }
        },

        {
            $sort: {
                weight: -1,
                createdAt: -1
            }
        },

        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                weight: 0
            }
        }
    ]);

    // 8. meta
    const total = await News.countDocuments({
        categorySlugs: { $in: slugs },
    });

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        },
    };
};



export const UserTrackSerive = {
    clickAndViews,
    getForYouNews
}