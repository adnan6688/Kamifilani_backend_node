import { model, Schema } from "mongoose";
import { Inotifications } from "./notification.interface";



const notificationSchema = new Schema<Inotifications>({
    title: { type: String, trim: true, required: [true, 'title must be required'], maxlength: 300 },
    headline: { type: String, trim: true, required: [true, 'headline must be included!'], maxlength: 600 },
    link: { type: String, trim: true, required: true },
    image: { type: String, required: true },
    publicId: { type: String }
}, {
    timestamps: true,
    versionKey: false
})


export const Notification = model<Inotifications>('Notification', notificationSchema)