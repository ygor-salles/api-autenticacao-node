import { getCustomRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { UserRespository } from '../repositories/UserRepository';

class UserService {
    private userRepository: Repository<User>;
    constructor() {
        this.userRepository = getCustomRepository(UserRespository);
    }

    async create(name: string, email: string, password: string, admin: boolean) {
        try {
            const userExists = await this.userRepository.findOne({ withDeleted: true, where: { email } })
            if (userExists && userExists.deleted_at !== null) {
                await this.userRepository.update(userExists.id, { name, email, password, admin, deleted_at: null })
                return { status: 200, message: 'Usuário registrado com sucesso' }
            }
            else if (userExists) {
                return { status: 400, message: 'Usuário já existe' }
            }
            else {
                const user = this.userRepository.create({ name, email, password, admin })
                await this.userRepository.save(user)
                delete user.password
                return { status: 201, obj: user }
            }
        } catch (error) {
            return { status: 400, message: 'Falha de conexão com o banco de dados' }
        }
    }
}

export { UserService }