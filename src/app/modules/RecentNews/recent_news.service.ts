/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { redisClient } from "../../config/redis";
import { cleanText } from "../../utils/cleanText";
import { BreakingNews } from "./recent.interface";
import { News } from "./news.model";
import cron from "node-cron";
import { BookMark } from "../BookMarks/bookmarks.model";
import { Types } from "mongoose";
import { CTRIMPRESSION } from "../CTRAndImpression/ctr.model";
import { sendSingleNotification, sendTopicNotification } from "../../utils/Notification/notification";
import AppError from "../../ErrorHelper/AppError";
import status from 'http-status-codes'
import { User } from "../User/user.model";
import { QueryBuilder } from "../../utils/QuiryBuilder";



const getAllRecentNewsService = async (per_page?: number, page?: number, search?: string, categorySlug?: string, user?: Types.ObjectId) => {

    // include category in cache key
    // const cacheKey = `news_${categorySlug || "all"}_${per_page}_${page}_${search || "all"}`;

    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //     return JSON.parse(cachedData);
    // }

    const params: any = {
        per_page: per_page || 10,
        page: page || 1,
        _embed: 1,
    };

    if (search) {
        params.search = search;
    }

    // handle category slug
    if (categorySlug) {
        const catCacheKey = `cat_${categorySlug}`;
        let categoryId;

        const cachedCat = await redisClient.get(catCacheKey);

        if (cachedCat) {
            categoryId = JSON.parse(cachedCat);
        } else {
            const catRes = await axios.get(
                "https://www.kemifilani.ng/wp-json/wp/v2/categories",
                {
                    params: { slug: categorySlug },
                }
            );

            const category = catRes.data?.[0];

            if (!category) {
                return {
                    total: 0,
                    totalPages: 0,
                    data: [],
                };
            }

            categoryId = category.id;

            // cache category id (1 hour)
            await redisClient.setEx(catCacheKey, 3600, JSON.stringify(categoryId));
        }

        // add category filter
        params.categories = categoryId;
    }


    // fetch posts
    const response = await axios.get(
        "https://www.kemifilani.ng/wp-json/wp/v2/posts",
        { params }
    );

    const total = response.headers["x-wp-total"];
    const totalPages = response.headers["x-wp-totalpages"];
    const data = response.data || [];

    const result = await Promise.all(
        data.map(async (post: any) => {

            let obj = {
                id: post.id,
                createdAt: post.date,
                title: cleanText(post.title?.rendered),
                description: cleanText(post.content?.rendered),
                image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
                category:
                    post._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [],
                categorySlugs:
                    post._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.slug) || [],
                author: {
                    name: post._embedded?.author?.[0]?.name || "Unknown",
                    image: post._embedded?.author?.[0]?.avatar_urls?.["96"] || null,
                },
                link: post.link,
            };


            const ckNews = await News.findOne({ id: obj.id });

            const ckBookMark = await BookMark.findOne({ newsId: ckNews?._id, userId: user })

            if (!ckNews) {
                const save = await News.create(obj);
                return {
                    ...save.toObject(),
                    isBookMarked: false,
                }
            }

            return {
                ...ckNews.toObject(),
                isBookMarked: !!ckBookMark,
            };
        })
    );



    const finalData = {
        total: Number(total),
        totalPages: Number(totalPages),
        data: result,
        currentPage: page || 1
    };


    // await redisClient.setEx(cacheKey, 480, JSON.stringify(finalData));

    return finalData;
};


const getNewsDetailsService = async (postId: number) => {
    const cacheKey = `news_details_${postId}`;


    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await axios.get(
        `https://www.kemifilani.ng/wp-json/wp/v2/posts/${postId}`,
        {
            params: {
                _embed: 1,
            },
        }
    );

    const post = response.data;

    const result = {
        id: post.id,
        date: post.date,

        title: cleanText(post.title?.rendered),


        description: cleanText(post.content?.rendered),

        image:
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,

        author: {
            name: post._embedded?.author?.[0]?.name || "Unknown",
            image:
                post._embedded?.author?.[0]?.avatar_urls?.["96"] || null,
        },

        link: post.link,
    };

    const finalData = {
        success: true,
        message: "News Details",
        data: result,
    };


    await redisClient.setEx(cacheKey, 600, JSON.stringify(finalData));

    return finalData;
};


type MediaResponse = {
    source_url: string;
};

const getImage = async (mediaId: number) => {
    try {
        const res = await fetch(
            `https://www.kemifilani.ng/wp-json/wp/v2/media/${mediaId}`
        );

        const data = (await res.json()) as MediaResponse;
        return data.source_url;
    } catch (err: any) {
        return null;
    }
};

type NewsItem = {
    id: string;
    date: string; // API gives string, NOT Date
    link: string;
    title: {
        rendered: string;
    };
    featured_media: number;
};


type BreakingNewsDTO = {
    newsId: number;
    title: string;
    link: string;
    image: string;
    date: Date;
};

const checkBreakingNewsIntoDB = async () => {
    const res = await fetch(
        "https://www.kemifilani.ng/wp-json/wp/v2/posts?_fields=id,title,link,date,featured_media&per_page=5"
    );

    const data = (await res.json()) as NewsItem[];

    const enrichedData = await Promise.all(
        data.map(async (item) => {
            const image = await getImage(item.featured_media);

            return {
                ...item,
                image,
            };
        })
    );

    const newlyAddedNews: BreakingNewsDTO[] = [];

    for (const item of enrichedData) {
        const exists = await BreakingNews.findOne({
            newsId: Number(item.id),
        });

        if (!exists) {
            const savedNews = await BreakingNews.create({
                newsId: Number(item.id),
                title: cleanText(item.title.rendered),
                link: item.link,
                image: item.image,
                date: item.date,
            });

            newlyAddedNews.push(savedNews.toObject() as BreakingNewsDTO);
        }
    }

    const allNews = await BreakingNews.find({ isBreaking: true })
        .sort({ createdAt: -1 })
        .limit(20);

    return {
        newlyAddedNews,
        allNews,
    };
};


const toggleBreakingNewsStatus = async (newsId: string) => {
    const news = await BreakingNews.findById(newsId);

    if (!news) {
        throw new AppError(status.NOT_FOUND, "News not found!");
    }




    const updated = await BreakingNews.findByIdAndUpdate(
        newsId,
        {
            $set: {
                isBreaking: !news.isBreaking,
            },
        },
        { returnDocument: 'after' }
    );


    const message = !updated?.isBreaking
        ? "Removed from latest news"
        : "Added to latest news";
    return message;
};



const adminNewsService = async (query: Record<string, string>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search || "";
    const isBreaking = query.isBreaking;


    const filter: any = {};


    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }


    if (isBreaking === "true") {
        filter.isBreaking = true;
    } else if (isBreaking === "false") {
        filter.isBreaking = false;
    }

    const total = await News.countDocuments(filter);

    const news = await News.find(filter)
        .skip(skip)
        .limit(limit)
        .lean();

    const newsIds: Types.ObjectId[] = news.map(
        (n) => new Types.ObjectId(n._id)
    );

    const impressions = await CTRIMPRESSION.find({
        newsId: { $in: newsIds },
    }).lean();

    const result = news.map((item) => {
        const stats = impressions.find(
            (i) => i.newsId && i.newsId.toString() === item._id.toString()
        );

        const clicks = stats?.clicks || 0;
        const imp = stats?.impressions || 0;

        const ctr = imp > 0 ? Math.min((clicks / imp) * 100, 100) : 0;

        return {
            ...item,
            clicks,
            impressions: imp,
            ctr: Number(ctr.toFixed(2)),
        };
    });

    const totalPage = Math.ceil(total / limit);

    return {
        data: result,
        meta: {
            total,
            page,
            limit,
            totalPage,
        },
    };
};



const customWiseBreakingNewsAdd = async (newsId: number) => {


    const ckNews = await News.findOne({ id: newsId })
    if (!ckNews) {
        throw new AppError(status.NOT_FOUND, 'News not found!')
    }


    const findFromBrekingsNews = await BreakingNews.findOne({ newsId: newsId })
    if (!findFromBrekingsNews) {
        const ans = await BreakingNews.create({
            newsId: Number(newsId),
            title: ckNews.title,
            link: ckNews.link,
            image: ckNews.image,
            date: ckNews.date
        })

        await News.findByIdAndUpdate({ _id: ckNews._id }, {
            $set: {
                isBreaking: ans?.isBreaking
            }
        })
        return 'Added to latest news'
    }




    const updatedBreakingNews = await BreakingNews.findOneAndUpdate({ newsId: newsId }, {
        $set: {
            isBreaking: !findFromBrekingsNews?.isBreaking
        },

    }, { returnDocument: 'after' })


    const updateNews = await News.findByIdAndUpdate({ _id: ckNews._id }, {
        $set: {
            isBreaking: updatedBreakingNews?.isBreaking
        }
    }, { returnDocument: 'after' })



    return updatedBreakingNews?.isBreaking ? "Added to latest news" : "Removed from latest news"
}



const allBreakingNews = async (query: Record<string, any>) => {

    const result = new QueryBuilder(BreakingNews.find(), query)
    const newsBuilder = result.fields().filter().search(['title']).sort().paginate()


    const [data, meta] = await Promise.all([
        newsBuilder.build(),
        result.getMeta()
    ]);
    return {
        data , meta
    }

}

// cron.schedule("0 0 */3 * *", async () => {
//     // eslint-disable-next-line no-console
//     console.log("Checking breaking news...");

//     try {
//         const result = await checkBreakingNewsIntoDB();
//         const { newlyAddedNews } = result;

//         if (newlyAddedNews.length === 0) {
//             // eslint-disable-next-line no-console
//             console.log("No new news");
//             return;
//         }

//         const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
//         // eslint-disable-next-line no-console
//         console.log(THREE_DAYS_AGO)

//         const inactiveUsers = await User.find({
//             lastActiveAt: { $lt: THREE_DAYS_AGO },
//             isDelete: false,
//             fcmToken: { $ne: "" },
//         });


//         // eslint-disable-next-line no-console
//         // console.log("inactive:", inactiveUsers.length);

//         for (const news of newlyAddedNews) {
//             const title = news.title as string;
//             const imageUrl = news.image as string;
//             const link = news.link as string

//             // send to active topic
//             await sendTopicNotification("breaking_news", title, imageUrl, link);

//         }

//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.error("Cron error:", error);
//     }
// });


cron.schedule("0 9 * * *", async () => {
    try {
        const result = await checkBreakingNewsIntoDB();
        const { newlyAddedNews } = result;

        if (!newlyAddedNews.length) {
            console.log("No new news");
            return;
        }

        const THREE_DAYS_AGO = new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
        );

        const inactiveUsers = await User.find({
            isDelete: false,
            fcmToken: { $ne: "" },
            lastActiveAt: { $lt: THREE_DAYS_AGO }
        });

        const latestnews = newlyAddedNews[0]

        for (const user of inactiveUsers) {
            await sendSingleNotification(user.fcmToken as string, latestnews.title, latestnews.image, latestnews.link);
        }

        // eslint-disable-next-line no-console
        console.log(
            `Sent notifications to ${inactiveUsers.length} inactive users`
        );
    } catch (error) {
        console.error(error);
    }
}, {
    timezone: "Africa/Lagos",
});


export const RecentNewsService = {
    getAllRecentNewsService,
    getNewsDetailsService,
    checkBreakingNewsIntoDB, adminNewsService,
    toggleBreakingNewsStatus,
    customWiseBreakingNewsAdd,
    allBreakingNews
};