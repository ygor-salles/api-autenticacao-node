import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from 'yup';
import { UserRespository } from "../repositories/UserRepository";

class UserController {
    async create(req: Request, resp: Response) {
        const { name, email, password, confirm_password, admin } = req.body

        const schema = yup.object().shape({
            name: yup.string().required('Nome é obrigatório'),
            email: yup.string().email('E-mail incorreto').required('E-mail é obrigatório'),
            password: yup.string().required('Senha é obrigatória'),
            confirm_password: yup.string().required('Confirmação de senha é obrigatória'),
            admin: yup.bool().required('Validação de campo administrador necessária')
        })
        try {
            await schema.validate(req.body, { abortEarly: false })
        } catch (error) {
            return resp.status(400).json({ message: error })
        }

        if (password !== confirm_password) {
            return resp.status(400).json({ message: 'As senhas não conferem' })
        }

        const connectionUser = getCustomRepository(UserRespository);

        const userExists = await connectionUser.findOne({ withDeleted: true, where: { email }})
        if (userExists && userExists.deleted_at !== null) {
            await connectionUser.update(userExists.id, { name, email, password, admin, deleted_at: null })
            return resp.status(200).json('Usuário registrado com sucesso!')
        }
        else if (userExists) {
            return resp.status(404).json({ message: 'Usuário já existe!' })
        }
        else {
            const user = connectionUser.create({ name, email, password, admin })
            await connectionUser.save(user)
            delete user.password
            return resp.status(201).json(user)
        }
    }

    async ready(req: Request, resp: Response) {
        const connectionUser = getCustomRepository(UserRespository)
        const allUsers = await connectionUser.find()
        allUsers.forEach(user => {
            delete user.password
        })
        return resp.json(allUsers)
    }

    async readyById(req: Request, resp: Response) {
        const { id } = req.params

        const connectionUser = getCustomRepository(UserRespository)
        const user = await connectionUser.findOne({ id })
        if (user) {
            delete user.password
            return resp.json(user)
        }
        return resp.status(404).json({ message: 'Usuário não existe!' })
    }

    async softDelete(req: Request, resp: Response) {
        const { id } = req.params

        const connectionUser = getCustomRepository(UserRespository)
        const user = await connectionUser.findOne({ id })
        if (user) {
            await connectionUser.softDelete(user.id);
            return resp.status(200).json({ message: 'Usuário removido com sucesso!' })
        }
        return resp.status(404).json({ message: 'Usuário não existe!' })
    }

    async update(req: Request, resp: Response) {
        const { id } = req.params
        const { name, email, password, confirm_password, admin } = req.body

        const schema = yup.object().shape({
            name: yup.string().required('Nome é obrigatório'),
            email: yup.string().email().required('E-mail é obrigatório'),
            password: yup.string().required('Senha é obrigatória'),
            confirm_password: yup.string().required('Confirmação de senha é obrigatória') 
        })
        try {
            await schema.validate(req.body, { abortEarly: false })
        } catch (error) {
            return resp.status(400).json({ message: error })
        }

        if (password !== confirm_password) {
            return resp.status(400).json({ message: 'As senhas não conferem' })
        }

        const connectionUser = getCustomRepository(UserRespository)
        const user = await connectionUser.findOne({ id })

        if (user) {
            await connectionUser.update(user.id, { name, email, password, admin })
            return resp.status(200).json({ message: 'Usuário atualizado com sucesso' })
        }

        return resp.status(404).json({ message: 'Usuário não existe' })
    }
}

export { UserController };