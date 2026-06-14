import bcrypt from 'bcrypt';
import jwt, {SignOptions} from 'jsonwebtoken';
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



