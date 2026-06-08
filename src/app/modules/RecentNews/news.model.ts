import { model, Schema } from "mongoose"


type Inews = {

    id: number,
    date: string,
    title: string,
    description: string,
    image: string | null,
    category: string[],
    categorySlugs: string[],
    author: {
        name: string,
        image: string | null
    },
    link: string,
    isBreaking: boolean,
}


const NewsSchema = new Schema<Inews>({

    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String || null },
    category: { type: [String] },
    categorySlugs: { type: [String] },
    author: {
        name: { type: String, required: true },
        image: { type: String || null }
    },
    link: { type: String, required: true },
    isBreaking: { type: Boolean, default: false }

}, {
    timestamps: true,
    versionKey: false
})


export const News = model<Inews>('News', NewsSchema)