import jwt from 'jsonwebtoken'


export const VerifiedTokenFh = async (token: string, secret: string) => {


    const verifiedtoken = jwt.verify(token,secret)


    return verifiedtoken


}