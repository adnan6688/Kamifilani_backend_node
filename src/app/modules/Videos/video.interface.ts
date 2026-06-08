import { Types } from "mongoose";



export interface IVideo {

    link: string;
    videoId : string;
    title : string;
    author_name : string;
    author_url : string;
    thumbnail : string;
    views : number | null;
    description : string | null;
    user : Types.ObjectId

}
