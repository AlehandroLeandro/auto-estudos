import { AppDataSource } from "../config/data-source";
import { RefreshTokenSession } from "../entities/RefreshTokenSession";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../entities/User";
import { hashPassword } from "../utils";

const refreshTokenSessionRepository = AppDataSource.getRepository(RefreshTokenSession);

type CreateRefreshTokenSessionInput = {
    user: User;
};

export const createRefreshToken = async({user,}: CreateRefreshTokenSessionInput): Promise<string> => {
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"];
    //cria o refresh token assinado com as informações do usuário e a chave secreta, e com o tempo de expiração definido no .env
    const refreshToken = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: refreshExpiresIn,
        }
    );
    //faz o hash do refresh token para armazenar no banco de dados, para não armazenar o token em si, por questões de segurança
    const tokenHash = await hashPassword(refreshToken);
    // cria um objeto do tipo sessao de refresh token
    const session = refreshTokenSessionRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + Number(refreshExpiresIn) * 1000),
        revokedAt: null,
        createdAt: new Date(),
    });
    //salva no banco de dados
    await refreshTokenSessionRepository.save(session);

    return refreshToken;


}