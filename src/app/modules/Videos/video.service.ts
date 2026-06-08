import axios from "axios";
import AppError from "../../ErrorHelper/AppError";
import statusCode from 'http-status-codes'
import { VideoModel } from "./video.model";
import { QueryBuilder } from "../../utils/QuiryBuilder";
const getVideoId = (url: string) => {
    return url.match(/[?&]v=([^&]+)/)?.[1] || null;
};



const cleanDescription = (text: string): string | null => {

    if (!text) return null;

    return text
        // normalize all newline types
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")

        // remove weird unicode spaces
        .replace(/\u00A0/g, " ")

        // collapse multiple new lines
        .replace(/\n\s*\n\s*\n+/g, "\n\n")

        // trim each line
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)

        .join("\n")

        // remove extra spaces
        .replace(/[ \t]{2,}/g, " ")
        .trim();
};


const getYoutubeData = async (videoUrl: string, userId: string): Promise<boolean> => {



    const videoId = getVideoId(videoUrl);

    if (!videoId) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid YouTube URL");
    }

    const oembed = await axios.get(
        `https://www.youtube.com/oembed?url=${videoUrl}&format=json`
    );

    let views = null;
    let description = null;


    const html = await axios.get(videoUrl).then(res => res.data);

    const match = html.match(
        /ytInitialPlayerResponse\s*=\s*({.+?});/
    );

    if (match) {
        const json = JSON.parse(match[1]);

        views = json?.videoDetails?.viewCount;
        description = json?.videoDetails?.shortDescription;
    }

    const ckVideo = await VideoModel.findOne({ videoId })
    if (ckVideo) {
        throw new AppError(statusCode.BAD_REQUEST, "This video Already Exits!")
    }

    const data = {
        videoId,
        title: oembed.data.title,
        author_name: oembed.data.author_name,
        author_url: oembed.data.author_url,
        thumbnail: oembed.data.thumbnail_url,

        views: views ? Number(views) : null,
        description: cleanDescription(description) || null,
        user: userId,
        link: videoUrl
    };


    await VideoModel.create(data)

    return true
};


const deleteVideo = async (videoId: string): Promise<boolean> => {



    const ckVideo = await VideoModel.findById(videoId)

    if (!ckVideo) {
        throw new AppError(statusCode.NOT_FOUND, "This video not found !")
    }
    await VideoModel.findOneAndDelete({ _id: videoId })

    return true
}


const getAllVideos = async (query: Record<string, string>) => {


    const videoQueryBuilder = new QueryBuilder(VideoModel.find(), query)

    const result = videoQueryBuilder.search(['title', 'author_name']).fields().sort().paginate().populate([{ path: 'user', select: 'name' }])

    const [data, meta] = await Promise.all([
        result.build(),
        videoQueryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    }
}



const recentAddedVideo = async () => {

    const result = await VideoModel.find().sort({ createdAt: -1 }).limit(3)

    return result || []
}

export const videoService = {
    getYoutubeData,
    deleteVideo,
    getAllVideos,
    recentAddedVideo
}
