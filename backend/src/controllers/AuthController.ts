import  bcrypt  from 'bcryptjs';
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRespository } from "../repositories/UserRepository";
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

class AuthController {
    async authenticate(req: Request, resp: Response) {
        const { email, password } = req.body

        const schema = yup.object().shape({
            email: yup.string().email('E-mail incorrect').required('E-mail is required'),
            password: yup.string().required('Password is required')
        })

        try {
            await schema.validate(req.body, { abortEarly: false })
        } catch (error) {
            return resp.status(400).json({ message: error })
        }

        const connectionUser = getCustomRepository(UserRespository);

        const user = await connectionUser.findOne({ where: {email} })

        if(!user){
            return resp.sendStatus(401)
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword) {
            return resp.sendStatus(401)
        }

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' })

        delete user.password
        
        return resp.json({
            user,
            token,
        })
    }
}

export { AuthController }