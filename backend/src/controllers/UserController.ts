import { Request, Response } from "express";
import * as yup from 'yup';
import { UserService } from "../services/UserService";

class UserController {
    async create(req: Request, resp: Response) {
        // Dados recebidos na requisição
        const { name, email, password, confirm_password, admin } = req.body

        // Validação dos campos recebidos no corpo da requisição
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

        // Conexão com o banco de dados chamando a service
        const userService = new UserService()
        try {
            const user = await userService.create(name, email, password, admin)
            if(user.status === 201){
                return resp.status(201).json(user.obj);
            } else {
                return resp.status(user.status).json({message: user.message})
            }            
        } catch (error) {
            return resp.status(400).json({ message: 'Falha de conexão com o banco de dados' })
        }

    }

    async ready(req: Request, resp: Response) {
        const userService = new UserService()
        try {
            const allUsers = await userService.ready()
            return resp.json(allUsers)
        } catch (error) {
            return resp.status(400).json({ message: 'Falha de conexão com o banco de dados' })
        }
    }

    async readyById(req: Request, resp: Response) {
        const { id } = req.params
        const userService = new UserService()
        try {
            const user = await userService.readyById(id)
            if(user.status === 200){
                return resp.json(user.obj)
            }
            return resp.status(user.status).json({ message: user.message })
        } catch (error) {
            return resp.status(400).json({ message: 'Falha de conexão com o banco de dados' }) 
        }
    }

    async softDelete(req: Request, resp: Response) {
        const { id } = req.params
        const userService = new UserService()
        try {
            const user = await userService.softDelete(id)
            return resp.status(user.status).json({ message: user.message })
        } catch (error) {
            return resp.status(400).json({ message: 'Falha de conexão com o banco de dados' })
        }
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

        const userService = new UserService()
        try {
            const user = await userService.update(id, name, email, password, admin)
            return resp.status(user.status).json({ message: user.message })
        } catch (error) {
            return resp.status(400).json({ message: 'Falha de conexão com o banco de dados' }) 
        }
    }
}

export { UserController };
