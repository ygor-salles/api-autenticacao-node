import { getCustomRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { UserRespository } from '../repositories/UserRepository';

class UserService {
    private connectUser: Repository<User>;
    constructor() {
        this.connectUser = getCustomRepository(UserRespository);
    }

    async create(name: string, email: string, password: string, admin: boolean) {
        try {
            const userExists = await this.connectUser.findOne({ withDeleted: true, where: { email } })
            if (userExists && userExists.deleted_at !== null) {
                await this.connectUser.update(userExists.id, { name, email, password, admin, deleted_at: null })
                return { status: 200, message: 'Usuário registrado com sucesso' }
            }
            else if (userExists) {
                return { status: 400, message: 'Usuário já existe' }
            }
            else {
                const user = this.connectUser.create({ name, email, password, admin })
                await this.connectUser.save(user)
                delete user.password
                return { status: 201, obj: user }
            }
        } catch (error) {
            throw error
        }
    }

    async ready() {
        try {
            const allUsers = await this.connectUser.find()
            allUsers.forEach(user => {
                delete user.password
            })
            return allUsers
        } catch (error) {
            throw error
        }
    }

    async readyById(id: string) {
        try {
            const user = await this.connectUser.findOne({ id })
            if (user) {
                delete user.password
                return { status: 200, obj: user }
            }
            return { status: 404, message: 'Usuário não existe!' }
        } catch (error) {
            throw error
        }
    }

    async softDelete(id: string) {
        try {
            const user = await this.connectUser.findOne({ id })
            if (user) {
                await this.connectUser.softDelete(user.id);
                return { status: 200, message: 'Usuário removido com sucesso!' }
            }
            return { status: 404, message: 'Usuário não existe!' }
        } catch (error) {
            throw error
        }
    }

    async update(id: string, name: string, email: string, password: string, admin: boolean) {
        try {
            const user = await this.connectUser.findOne({ id })
            if (user) {
                await this.connectUser.update(user.id, { name, email, password, admin })
                return { status: 200, message: 'Usuário atualizado com sucesso!' }
            }
            return { status: 404, message: 'Usuário não existe!' }
        } catch (error) {
            throw error
        }
    }
}

export { UserService }