import { RequestHandler, Router } from "express";
import db from "../db";
import { check, validationResult } from 'express-validator'

const router = Router();

const userTodo: RequestHandler = async (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }
    const todo = await db.post.findUnique({
        where:{
            id: req.params.uuid
        }
    })

    if(todo?.userId != req.user?.id){
        return res.status(401).json({message: 'Unauthorized'})
    }
    console.log(todo?.userId, req.user?.id)

    return next()
}       

router.get('/posts', async (req, res)=>{
    try{
        const posts = await db.post.findMany({
            where:{
                userId: req.user?.id,
                isDeleted: false
            },
            select:{
                name:true,
                content:true,
                Comments: {
                    select:{
                        text:true,
                        id:true,
                        created_by:true,
                        created_at:true,
                    },
                    where:{
                        isDeleted: false
                    }
                },
                id:true,
                created_at:true,
            }
        })
        res.status(200).json({posts})
    }catch(e){
        console.log(e)
    }
})

router.get('/posts/all/', async (req, res)=>{
    try {
        const posts = await db.post.findMany({
            select:{
                name:true,
                content:true,
                Comments: true,
                id:true,
            }
        })
        res.status(200).json({posts})
    }catch(e){
        console.log(e)
    }
});

router.get('/post/:uuid' , async (req, res)=>{
    try{
        const post = await db.post.findUnique({
            where:{
                id: req.params.uuid
            },
            select:{
                Comments: {
                    select:{
                        text:true,
                        id:true,
                        created_by:true,
                        created_at:true,
                    }
                },
                name:true,
                content:true,
                id:true,
                user:true,
                created_at:true
            }
        })
        res.status(200).json({post})
    }catch(e){
        console.log(e)
    }
});

router.post('/post', 
    check('title').isLength({min: 8}).withMessage('Le titre doit faire au moins 8 caractères'),
    async (req, res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
    try{
        if(!req.user){
            return res.status(401).json({message: 'Unauthorized'})
        }

        const post = await db.post.create({
            data:{
                name: req.body.title,
                content:req.body.content,
                userId: req.user.id,
            }
        })
        res.status(200).json({post})
    
    }catch(e){
        console.log(e)
    }
});

router.delete('/post/:uuid',userTodo, async (req, res)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{

        const todo = await db.post.update({
            where:{
                id: req.params.uuid
            },
            data:{
                isDeleted: true
            }
        })
        res.status(200).json({todo})
    }catch(e){
        console.log(e)
    }
});

router.put('/post/:uuid', userTodo,
    check('title').isLength({min: 8}).withMessage('Le titre doit faire au moins 8 caractères'),
    async (req, res)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        if(!req.user){
            return res.status(401).json({message: 'Unauthorized'})
        }

        const post = await db.post.update({
            where:{
                id: req.params.uuid
            },
            data:{
                name: req.body.title,
                content:req.body.content,
            }
        })
        res.status(200).json({post})
    }catch(e){
        console.log(e)
    }
});

router.get('/user', async (req, res)=>{
    try{
        if(!req.user){
            return res.status(401).json({message: 'Unauthorized'})
        }
        const user = await db.user.findUnique({
            where:{
                id: req.user.id
            },
            select:{
                id:true,
                username:true,
                posts: true
            }
        })
        res.status(200).json({user})
    }catch(e){
        console.log(e)
    }
})




export default router;