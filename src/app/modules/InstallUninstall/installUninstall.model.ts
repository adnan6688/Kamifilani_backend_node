import { model, Schema, Types } from "mongoose";
import { IInstallUninstall } from "./installUninstall.interface";



const InstallUnInstallSchema = new Schema<IInstallUninstall>({

    userId: { type: Types.ObjectId, required: [true, 'User id must be included!'] },
    installCount: { type: Number, default: 0, min: 0 },
    uninstallCount: { type: Number, default: 0, min: 0 }

}, {
    versionKey: false,
    timestamps: true
})


export const InstallUninstall = model<IInstallUninstall>('InstallUninstall', InstallUnInstallSchema)