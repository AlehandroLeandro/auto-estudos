import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const findUserByIdOrThrow = async (userId: number): Promise<User> => {
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    return user;
};
