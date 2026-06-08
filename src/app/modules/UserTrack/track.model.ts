import { model, Schema, Types } from "mongoose";
import { IUserTrack } from "./track.interface";






const userTrackSchema = new Schema<IUserTrack>({

    userId: { type: Types.ObjectId, required: [true, 'user id must be add'] },
    categorySlug: { type: String, trim: true, required: [true, 'slug must be include!'] },
    Clicks: { type: Number, default: 0, min: 0 }
}, {
    versionKey : false,
    timestamps : true
})

export const UserTrack = model<IUserTrack>('UserTrack', userTrackSchema)