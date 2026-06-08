import { Types } from "mongoose";



export interface IInstallUninstall {

    _id? : Types.ObjectId,
    userId : Types.ObjectId,
    installCount : number,
    uninstallCount : number,
    
}