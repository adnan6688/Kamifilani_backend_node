import { model, Schema } from "mongoose";
import { IBanner } from "./banner.interface";





const bannerSchema = new Schema<IBanner>({

    title: { type: String, min: [3, 'Minimum length 3 characters'] },
    image: { type: String, required: [true, 'Image must be included!'] },
    link: { type: String, required: [true, 'Link must be added!'] },
    publicId: { type: String },
    click: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 }
}, {
    timestamps: true,
    versionKey: false
})

export const Bannar = model<IBanner>('Bannar', bannerSchema)