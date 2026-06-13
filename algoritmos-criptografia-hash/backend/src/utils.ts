import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
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

