import { model, Schema } from "mongoose";




interface Iadmob {
    isOPen: boolean;
}


const admobSchema = new Schema<Iadmob>({
    isOPen: { type: Boolean, required: true, default: true }
}, {
    versionKey: false,
    timestamps: true
})

export const Admob = model<Iadmob>('Admob', admobSchema)