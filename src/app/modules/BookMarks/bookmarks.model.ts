import { model, Schema, Types } from "mongoose";
import { IbookMarks } from "./bookmarks.interface";





const bookMarkSchema = new Schema<IbookMarks>({

    userId: {
        type: Types.ObjectId,
        required: [true, "UserId Must be required!"],
        ref: "User",
    },
    newsId: {
        type: Types.ObjectId, required: [true, 'News Id must be required!'],
        ref: "News"
    }
}, {
    versionKey: false,
    timestamps: true
})

export const BookMark = model<IbookMarks>('BookMark', bookMarkSchema)