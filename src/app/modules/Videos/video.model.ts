import { Schema, model } from "mongoose";
import { IVideo } from "./video.interface";

export const VideoSchema = new Schema<IVideo>(
    {
        link: { type: String, required: true },


        videoId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        author_name: {
            type: String,
            required: true
        },

        author_url: {
            type: String,
            required: true
        },

        thumbnail: {
            type: String,
            required: true
        },

        views: {
            type: Number,
            default: null
        },

        description: {
            type: String,
            default: null
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
        versionKey : false
    }
);

// Model
export const VideoModel = model<IVideo>("Video", VideoSchema);