import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import {hashPassword} from "../utils";


const userRepository = AppDataSource.getRepository(User);

type UserRegisterInput = {
    name: string;
    email: string;
    password: string;
}

export const registerAccount = async (input: UserRegisterInput) => {
    const { name, email, password } = input;

    const contaExistente = await userRepository.findOneBy({ email });

    if(!contaExistente) {
        const hashedPassword = await hashPassword(password);
        const newUser = userRepository.create({ name, email, hashedPassword });
        await userRepository.save(newUser);
        return "Usuário registrado com sucesso";
    } else {
        throw new Error("E-mail indisponível");
    }
}