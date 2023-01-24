import { User } from "@prisma/client";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

export const createJWT = (user : User)=>{
    const token = jwt.sign(
        {id: user.id, username: user.username},
        process.env.JWT_SECRET as string
    )
    
    return token
}

export const protect:RequestHandler = (req, res, next)=>{
    const bearer = req.headers.authorization

    if(!bearer || !bearer.startsWith('Bearer ')){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const [,token] = bearer.split(' ')

    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{

        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as User

        req.user = payload  
        next()

    }catch(e){
        return res.status(401).json({message: 'Unauthorized'})
    }
}

export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash)
}

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10)
}

