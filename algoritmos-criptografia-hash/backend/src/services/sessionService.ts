import { AppDataSource } from "../config/data-source";
import { Session } from "../entities/Session";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../entities/User";
import { hashPassword, verifyPassword } from "../utils";

const sessionRepository = AppDataSource.getRepository(Session);

type CreateSessionInput = {
    user: User;
};

export type RefreshTokenPayload = {
    userId: number;
    sessionId: number;
};

const getRefreshTokenExpiresAt = (refreshToken: string): Date => {
    const decodedToken = jwt.decode(refreshToken) as { exp?: number } | null;

    if (!decodedToken?.exp) {
        throw new Error("Não foi possível determinar a expiração do refresh token");
    }

    return new Date(decodedToken.exp * 1000);
};

export const createSession = async ({ user }: CreateSessionInput): Promise<string> => {
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"];
    const session = sessionRepository.create({
        userId: user.id,
        refreshTokenHash: "",
        expiresAt: new Date(),
        revokedAt: null,
        createdAt: new Date(),
    });

    await sessionRepository.save(session);

    const refreshToken = jwt.sign(
        {
            userId: user.id,
            sessionId: session.id,
        },
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: refreshExpiresIn,
        }
    );

    session.refreshTokenHash = await hashPassword(refreshToken);
    session.expiresAt = getRefreshTokenExpiresAt(refreshToken);

    await sessionRepository.save(session);

    return refreshToken;
};

export const verifyRefreshTokenSignature = (refreshToken: string): RefreshTokenPayload => {
    return jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
    ) as RefreshTokenPayload;
};

export const findSessionByIdAndUserIdOrThrow = async (
    sessionId: number,
    userId: number
): Promise<Session> => {
    const session = await sessionRepository.findOneBy({ id: sessionId, userId });

    if (!session) {
        throw new Error("Sessão não encontrada");
    }

    return session;
};

export const ensureSessionIsActive = (session: Session): void => {
    if (session.revokedAt) {
        throw new Error("Sessão já foi revogada");
    }

    if (session.expiresAt < new Date()) {
        throw new Error("Sessão já expirou");
    }
};

export const ensureRefreshTokenMatchesSession = async (
    refreshToken: string,
    session: Session
): Promise<void> => {
    const tokenMatches = await verifyPassword(refreshToken, session.refreshTokenHash);

    if (!tokenMatches) {
        throw new Error("Token de refresh inválido");
    }
};

export const revokeSession = async (session: Session): Promise<void> => {
    session.revokedAt = new Date();
    await sessionRepository.save(session);
};
