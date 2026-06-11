import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { User } from './entities/User';

export async function hashPassword(password: string): Promise<string>{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    return hashedPassword;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, storedHash);
  return isMatch; 
}

export function generateAccessToken(user: User): string {
    const generateExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN) as SignOptions["expiresIn"];  //TS não reconhece o tipo do que vem do .env, então tem que fazer essa maracutaia
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: user.name
        },
        process.env.JWT_ACCESS_SECRET as string,
        { 
            expiresIn: generateExpiresIn
        }
    )
}

export function generateRefreshToken(user: User): string {
    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN) as SignOptions["expiresIn"];
    return jwt.sign(
     {
         userId: user.id,
         email: user.email,
         name: user.name
     },
     process.env.JWT_REFRESH_SECRET as string,
     { 
         expiresIn: refreshExpiresIn
     }
    )
 }