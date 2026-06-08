import admin from "../../config/firebaseConfig";

export const sendTopicNotification = async (topic: string, title: string, imageUrl?: string, link?: string) => {
    try {
        const message = {
            topic: topic,

            data: {
                title: "Latest News",
                body: title,
                imageUrl: imageUrl || "",
                link: link || ""
            },
            notification: {
                title: "Latest News",
                body: title,
                imageUrl: imageUrl || ""
            },
        };

        const response = await admin.messaging().send(message);


        return {
            success: true,
            message: "Notification sent successfully",
            response,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};


export const sendSingleNotification = async (token: string, title: string, body: string, imageUrl?: string) => {

    try {

        const message: admin.messaging.Message = {
            token,

            data: {
                title: title,
                body: body,
                imageUrl: imageUrl || "https://static.vecteezy.com/system/resources/thumbnails/003/542/156/small/smiling-beautiful-woman-looking-straight-into-the-camera-on-the-street-under-a-green-tree-free-photo.JPG",
            },


            notification: {
                title: title,
                body: body,
                imageUrl: imageUrl || "https://static.vecteezy.com/system/resources/thumbnails/003/542/156/small/smiling-beautiful-woman-looking-straight-into-the-camera-on-the-street-under-a-green-tree-free-photo.JPG",
            },

        };

        const response = await admin.messaging().send(message);
        return {
            success: true,
            message: "Notification sent successfully",
            response,
        };


    } catch (error: any) {

        return {
            success: false,
            message: error.message,
        };
    }
};


export const sendTopicNotificationCustom = async (title: string, imageUrl?: string, headline?: string, link?: string) => {
    try {
        const message = {
            topic: "breaking_news",

            notification: {
                title: title,
                body: headline ?? "",
                imageUrl: imageUrl ?? "",
    
            },

            data: {
                title: title,
                body: headline ?? "",
                imageUrl: imageUrl ?? "",
                link: link ?? "",
            },
        };

        const response = await admin.messaging().send(message);



        return {
            success: true,
            message: "Notification sent successfully",
            response,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};
