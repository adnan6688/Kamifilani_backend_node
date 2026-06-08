







import { Types } from "mongoose"


export enum ActionType {
    CLICK = 'CLICK',
}

export type IUserTrack = {
    _id? : Types.ObjectId,
    userId : Types.ObjectId,
    categorySlug : string,
    Clicks : number,

}