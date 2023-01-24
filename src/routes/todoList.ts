import { RequestHandler, Router } from "express";
import db from "../db";
import { check, validationResult } from 'express-validator'

const router = Router();

const userTodo: RequestHandler = async (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }
    const todo = await db.todoList.findUnique({
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

router.get('/todos', async (req, res)=>{
    const todos = await db.todoList.findMany({
        where:{
            userId: req.user?.id
        },
        select:{
            id: true,
            name:true,
            todoItems: true
        }
    })
    res.status(200).json({todos})
})

router.get('/todo/:uuid', userTodo , async (req, res)=>{
        const todo = await db.todoList.findUnique({
            where:{
                id: req.params.uuid
            },
            select:{
                todoItems: true,
            }
        })
        res.status(200).json({todo})
});

router.post('/todo', 
    check('title').isLength({min: 8}).withMessage('Le titre doit faire au moins 8 caractères'),
    async (req, res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const todo = await db.todoList.create({
        data:{
            name: req.body.title,
le        }
    })
    res.status(200).json({todo})
});

router.delete('/todo/:uuid',userTodo, async (req, res)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const todo = await db.todoList.delete({
        where:{
            id: req.params.uuid
        }
    })
    res.status(200).json({todo})
});

router.put('/todo/:uuid', userTodo,
    check('title').isLength({min: 8}).withMessage('Le titre doit faire au moins 8 caractères'),
    async (req, res)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const todo = await db.todoList.update({
        where:{
            id: req.params.uuid
        },
        data:{
            name: req.body.title
        }
    })
    res.status(200).json({todo})
});


export default router;