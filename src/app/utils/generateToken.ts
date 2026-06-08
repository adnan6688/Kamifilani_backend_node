
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";




export const generateTokenFn = async (payload: JwtPayload, secret: string, expiresIn: string) => {

    const token = jwt.sign(payload, secret, {
        expiresIn: expiresIn
    } as SignOptions)

    return token
}
