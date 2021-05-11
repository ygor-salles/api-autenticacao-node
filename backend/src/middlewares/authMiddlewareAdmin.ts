import { getCustomRepository } from 'typeorm';
import  jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { UserRespository } from '../repositories/UserRepository';

interface TokenPayload {
    id: string
    iat: number
    exp: number
}

export default async function authMiddlewareAdmin(req: Request, resp: Response, next: NextFunction) {
    const { authorization } = req.headers

    if(!authorization) {
        return resp.sendStatus(401)
    }

    const token = authorization.replace('Bearer', '').trim()

    try {
        const data = jwt.verify(token, 'secret')
        const { id } = data as TokenPayload
        
        const connectUser = getCustomRepository(UserRespository)
        const user = await connectUser.findOne({ where: {id: id, admin: true} })
        if(!user) throw 'User not admin'

        req.userId = id
        return next()
    } catch {
        return resp.sendStatus(401)
    }
}