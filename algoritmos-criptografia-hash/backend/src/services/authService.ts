import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import {verifyPassword} from "../utils";

const userRepository = AppDataSource.getRepository(User);

type LoginInput = {
    email: string;
    password: string;
}

export const login = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await userRepository.findOneBy({ email });
    const isPasswordValid = user ? await verifyPassword(password, user.hashedPassword) : false;

    if(!user || !isPasswordValid) {
        throw new Error("Usuário ou senha incorretos");
    }
     


}