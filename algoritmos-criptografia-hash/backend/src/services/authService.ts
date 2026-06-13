import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import {verifyPassword, createAccessToken} from "../utils";
import { createRefreshToken } from "./refreshTokenSessionService";

const userRepository = AppDataSource.getRepository(User);

type LoginInput = {
    email: string;
    password: string;
}
type LogoutInput = {
    userId: number;
}

export const login = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await userRepository.findOneBy({ email });
    const isPasswordValid = user ? await verifyPassword(password, user.hashedPassword) : false;

    if(!user || !isPasswordValid) {
        throw new Error("Usuário ou senha incorretos");
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken({user});
     
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,  
            role: user.role
        }
        ,
        accessToken,
        refreshToken
    }
}

export const logout = async (input: LogoutInput) => {
    const { userId } = input;
    const user = await userRepository.findOneBy({ id: userId });

    if(!user) {
        throw new Error("Usuário não encontrado");
    }

    //remover acces e refresh token

}