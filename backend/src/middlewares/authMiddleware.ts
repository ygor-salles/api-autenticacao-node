import  jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

interface TokenPayload {
    id: string
    iat: number
    exp: number
}

export default function authMiddleware(req: Request, resp: Response, next: NextFunction) {
    const { authorization } = req.headers

    if(!authorization) {
        return resp.sendStatus(401)
    }

    const token = authorization.replace('Bearer', '').trim()

    try {
        const data = jwt.verify(token, 'secret')
        // console.log(data)

        const { id } = data as TokenPayload

        req.userId = id

        return next()
    } catch {
        return resp.sendStatus(401)
    }
}