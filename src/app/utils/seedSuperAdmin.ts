/* eslint-disable no-console */
import bcrypt from "bcryptjs"
import { envVars } from "../config/env"
import { UserType } from "../modules/User/user.interface"
import { User } from "../modules/User/user.model"
import { Admob } from "../modules/Admob/admob.model"

export const seedSuperAdmin = async () => {
    const adminEmail = envVars.ADMIN_EMAIL as string;

    const ckAdmin = await User.findOne({
        email: adminEmail,
        role: UserType.ADMIN,
    });

    if (!ckAdmin) {
        console.log("Admin Creating....");

        const hashPass = await bcrypt.hash(
            envVars.ADMIN_PASS as string,
            Number(envVars.PASSWORD_HASH_SALT)
        );

        await User.create({
            name: "Golam Faruk Adnan",
            role: UserType.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashPass,
            birth_date: "12-06-2004",
            isDelete: false,
            deviceId: null,
        });

        console.log("Admin Created Successfully!");
    } else {
        console.log("Admin Already Created!");
    }

    // Admob singleton
    const ckCreateadmob = await Admob.countDocuments();

    if (!ckCreateadmob) {
        await Admob.create({ isOPen: true });
        console.log("Admob settings created successfully");
    } else {
        console.log("Admob settings already exist");
    }
};