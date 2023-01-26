import { Request, RequestHandler } from "express";
import db from "../db";

import { createJWT, hashPassword, comparePassword } from "../modules/auth";

interface TypeRequestParam extends Request{
    body:{
        username?:string,
        password?:string
    }
}
export const createNewUser:RequestHandler = async (req: TypeRequestParam, res, next)=>{
    const {username, password} = req.body
    try{
        if(!username || !password){
            throw new Error('Username and password are required')
        }

        const hash = await hashPassword(password)
        console.log(password)
        const user = await db.user.create({
            data:{
                username: username,
                password:hash
            }
        })

        const token = createJWT(user)
        res.status(200).json({token})
    
    }catch(e){
        console.log(e)
        return res.status(400).json({message: e})
    }

}

export const signIn:RequestHandler = async (req: TypeRequestParam, res, next)=>{
    const {username, password} = req.body
    try{
        if(!username || !password){
            throw new Error('Username and password are required')
        }

        const user = await db.user.findUnique({
            where:{
                username
            }
        })
        console.log(user)
        if(!user){
            throw new Error('User not found')
        }

        if(!await comparePassword(password, user.password)){
            throw new Error('Password is incorrect')
        }

        const token = createJWT(user)
        res.status(200).json({token})
    
    }catch(e){
        return res.status(400).json({message: "error"})
    }

}



