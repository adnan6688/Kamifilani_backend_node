import { model, Schema } from "mongoose";
import { ctrType, ICTRANDIMPRESSION } from "./cts.interface";





const CTRSchema = new Schema<ICTRANDIMPRESSION>({


    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user must be included'] },
    type: { type: String, enum: ctrType, required: [true, 'type must be included!'] },
    newsId: { type: Schema.Types.ObjectId , ref : 'News' }, 
    bannarsId : {type : Schema.Types.ObjectId , ref : 'Bannar'}
}, {
    versionKey: false,
    timestamps: true
})

export const CTRIMPRESSION = model<ICTRANDIMPRESSION>('CTRIMPRESSION', CTRSchema)