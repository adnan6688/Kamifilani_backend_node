import { model, Schema } from "mongoose";




interface Iadmob {
    isOPen: boolean
    birthDay?: string
}


const admobSchema = new Schema<Iadmob>({
    isOPen: { type: Boolean, required: true, default: true },
    birthDay: { type: String, default: '🎉 Happy Birthday! Wishing you joy, love, and happiness always. ❤️', trim: true }
}, {
    versionKey: false,
    timestamps: true
})

export const Admob = model<Iadmob>('Admob', admobSchema)