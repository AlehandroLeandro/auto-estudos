import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import { verifyPassword } from "../utils";
import { createAccessToken } from "./accesTokenService";
import {
    createSession,
    ensureRefreshTokenMatchesSession,
    ensureSessionIsActive,
    findSessionByIdAndUserIdOrThrow,
    revokeSession,
    verifyRefreshTokenSignature
} from "./sessionService";
import { findUserByIdOrThrow } from "./userService";

const userRepository = AppDataSource.getRepository(User);

type LoginInput = {
    email: string;
    password: string;
}

type LogoutInput = {
    authenticatedUserId: number;
    refreshToken: string;
}

export const login = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await userRepository.findOneBy({ email });
    const isPasswordValid = user ? await verifyPassword(password, user.hashedPassword) : false;

    if (!user || !isPasswordValid) {
        throw new Error("Usuário ou senha incorretos");
    }

    const accessToken = createAccessToken(user);
    const refreshToken = await createSession({ user });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

export const logout = async ({
    authenticatedUserId,
    refreshToken
}: LogoutInput): Promise<void> => {
    if (!refreshToken) {
        throw new Error("Refresh token é necessário para logout");
    }

    const payload = verifyRefreshTokenSignature(refreshToken);

    if (payload.userId !== authenticatedUserId) {
        throw new Error("Token de refresh inválido para o usuário autenticado");
    }

    await findUserByIdOrThrow(authenticatedUserId);

    const session = await findSessionByIdAndUserIdOrThrow(payload.sessionId, authenticatedUserId);

    ensureSessionIsActive(session);
    await ensureRefreshTokenMatchesSession(refreshToken, session);
    await revokeSession(session);
};
