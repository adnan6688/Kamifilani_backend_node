import { User } from "../User/user.model";
import { Admob } from "./admob.model";

const birthDayService = async () => {
    const users = await User.find();

    const today: any[] = [];
    const tomorrow: any[] = [];
    const nextFiveDays: any[] = [];

    const now = new Date();

    const getMD = (date: Date) =>
        `${date.getMonth()}-${date.getDate()}`;

    const todayMD = getMD(now);

    const tomorrowdate = new Date(now);
    tomorrowdate.setDate(now.getDate() + 1);
    const tomorrowMD = getMD(tomorrowdate);

    const fiveDays = new Date(now);
    fiveDays.setDate(now.getDate() + 5);

    users.forEach((user) => {
        if (!user.birth_date) return;

        const birth = new Date(user.birth_date);

        const birthMD = getMD(birth);

        // TODAY
        if (birthMD === todayMD) {
            today.push({
                id: user?._id,
                name: user?.name,
                image: user?.image ?? null,
                role: user?.role,
                date: user?.birth_date
            });
            return;
        }

        // TOMORROW
        if (birthMD === tomorrowMD) {
            tomorrow.push({
                id: user?._id,
                name: user?.name,
                image: user?.image ?? null,
                role: user?.role,
                date: user?.birth_date
            });
            return;
        }

        // NEXT 5 DAYS (same year basis)
        const thisYearBirth = new Date(
            now.getFullYear(),
            birth.getMonth(),
            birth.getDate()
        );

        const diff =
            (thisYearBirth.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24);

        if (diff > 1 && diff <= 5) {
            nextFiveDays.push({
                id: user?._id,
                name: user?.name,
                image: user?.image ?? null,
                role: user?.role,
                date: user?.birth_date
            });
            return;
        }
    });

    const bithdayMessage = await Admob.find()


    return {
        today,
        tomorrow,
        nextFiveDays,
        birthday: { message: bithdayMessage[0].birthDay, _id: bithdayMessage[0]?._id }
    };
};



export default birthDayService;