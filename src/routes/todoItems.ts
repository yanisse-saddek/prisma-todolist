import { Request, RequestHandler, Router } from "express";
import db from "../db";
import { check, validationResult } from 'express-validator'
const router = Router();



const userTodo: RequestHandler = async (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }
    const todo = await db.todoItem.findUnique({
        where:{
            id: req.params.uuid
        },
        select:{
            todoList: true
        }
    })

    console.log(todo?.todoList.userId, req.user?.id)
    if(todo?.todoList.userId != req.user?.id){
        return res.status(401).json({message: 'Unauthorized'})
    }

    return next()
}

router.post('/todoitem', 
        check('description').isLength({min: 8}).withMessage('La description doit faire au moins 8 caractères'),
        async (req, res)=>{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }

    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const todoItem = await db.todoItem.create({
        data:{
            description: req.body.description,
            todoListId: req.body.todoId
        }
    })
    res.status(200).json({todoItem})
});

router.put('/todoItem/:uuid',
        check('description').isLength({min: 8}).withMessage('La description doit faire au moins 8 caractères'),
        userTodo, async (req, res)=>{
    const todoItem = await db.todoItem.update({
        where:{
            id: req.params.uuid
        },
        data:{
            description: req.body.description
        }
    })
    res.status(200).json({todoItem})
});

router.delete('/todoItem/:uuid', userTodo, async (req, res)=>{
    const todoItem = await db.todoItem.delete({
        where:{
            id: req.params.uuid
        }
    })
    res.status(200).json({todoItem})
});

export default router;