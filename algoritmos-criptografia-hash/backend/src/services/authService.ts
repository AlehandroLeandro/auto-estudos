import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import {verifyPassword, createAccessToken} from "../utils";
import { createRefreshToken } from "./refreshTokenSessionService";
import { RefreshTokenSession } from "../entities/RefreshTokenSession";
import jwt from "jsonwebtoken";


const userRepository = AppDataSource.getRepository(User);
const refreshTokenSessionRepository = AppDataSource.getRepository(RefreshTokenSession);

type LoginInput = {
    email: string;
    password: string;
}
type LogoutInput = {
    authenticatedUserId: number;
    refreshToken: string;
}

type RefreshTokenPayload = {
    userId: number;
    sessionId: number;
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

export const logout = async ({
    authenticatedUserId,
    refreshToken
}: LogoutInput): Promise<void> => {
    if(!refreshToken) {
        throw new Error("Refresh token é necessário para logout");
    }
    //verifica se o token que veio pela sessão foi assinado pela chave correta, se ele não foi adulterado 
    const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
    ) as RefreshTokenPayload;
    //valida se o id do usuário que veio no token é o mesmo do usuário autenticado 
    if(payload.userId !== authenticatedUserId) {
        throw new Error("Token de refresh inválido para o usuário autenticado");
    }
    const user = await userRepository.findOneBy({id: authenticatedUserId});

    if  (!user) {
        throw new Error("Usuário não encontrado para o token de refresh fornecido");
    }
    //verifica se se existe uma sessão com o mesmo id no banco e se ela pertence ao usuário autenticado
    const session = await refreshTokenSessionRepository.findOneBy({id: payload.sessionId, userId: authenticatedUserId});

    if (!session) {
        throw new Error("Sessão não encontrada")
    }

    if(session.revokedAt) {
        throw new Error("Sessão já foi revogada");
    }
    if(session.expiresAt < new Date()) {
        throw new Error("Sessão já expirou");
    }
    //função de verifyPassword verifica o hash do token
    const tokenMatches = await verifyPassword(refreshToken, session.tokenHash);

    if (!tokenMatches) {
        throw new Error("Token de refresh inválido");
    }

    session.revokedAt = new Date();
    await refreshTokenSessionRepository.save(session);
}

