import { model, Schema } from "mongoose";
import { IUser, UserType } from './user.interface';




// create user schema for user model
const userSchema = new Schema<IUser>({

    name: {
        type: String,
        trim: true,
        min: [2, 'Minimum character will be 2 characters!'],
        max: [25, 'Maximum character will be 25 characters!']
    },
    deviceId: {
        type: String || null,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ],
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        min: [8, 'Password must be at least 8 characters'],
        max: [15, 'Password cannot be more than 15 characters']
    },

    role: {
        type: String,
        required: true,
        default: UserType.USER,
        enum: Object.values(UserType)
    },
    birthDayNotification: {
        type: Boolean,
        default: true
    },
    breakingNewsNotification: {
        type: Boolean,
        default: true
    },

    isDelete: {
        type: Boolean,
        default: false
    },
    fcmToken: {
        type: String,
        trim: true,
        default: null
    },
    birth_date: {
        type: Date,
        validate: {
            validator: function (value: Date) {
                return value <= new Date();
            },
            message: "Birth date cannot be in the future"
        }
    },
    image: {
        type: String,
        default: null
    },
    lastActiveAt: {
        type: Date, 
        default : Date.now()
    }
},
    {
        timestamps: true,
        versionKey: false
    }

)


// user model create
export const User = model<IUser>('User', userSchema)