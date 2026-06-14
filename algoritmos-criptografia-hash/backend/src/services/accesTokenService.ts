import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../entities/User";

type AccessTokenPayload = {
    userId: number;
    email: string;
    name: string;
    role: string;
};

export function createAccessToken(user: User): string {
    const generateExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN) as SignOptions["expiresIn"];  //TS não reconhece o tipo do que vem do .env, então tem que fazer essa maracutaia
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET as string,
        { 
            expiresIn: generateExpiresIn
        }
    )
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
    ) as AccessTokenPayload;
}