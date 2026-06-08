import { model, Schema } from "mongoose";
import { Icategory } from "./category.interface";






const categorySchema = new Schema<Icategory>({

    id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true }
}, { timestamps: true, versionKey: false })

export const Category = model<Icategory>('Category', categorySchema)