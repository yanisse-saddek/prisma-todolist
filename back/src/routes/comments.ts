import { Request, RequestHandler, Router } from "express";
import db from "../db";
import { check, validationResult } from 'express-validator'
const router = Router();



const userTodo: RequestHandler = async (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }
    const comment = await db.comment.findUnique({
        where:{
            id: req.params.uuid
        },
        select:{
            text: true,
            post:true
        }
    })

    if(comment?.post.userId != req.user?.id){
        return res.status(401).json({message: 'Unauthorized'})
    }

    return next()
}
const checkuser: RequestHandler = async (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
    }
    const comment = await db.comment.findUnique({
        where:{
            id: req.params.uuid
        },
        select:{
            text: true,
            post:true,
            created_by:true,
        }
    })

    if(comment?.created_by.id != req.user?.id){
        return res.status(401).json({message: 'Unauthorized'})
    }

    return next()
}
router.post('/comment', 
        check('text').isLength({min: 8}).withMessage('La description doit faire au moins 8 caractères'),
        async (req, res)=>{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }
    try{
        if(!req.user){
            return res.status(401).json({message: 'Unauthorized'})
        }

        const comment = await db.comment.create({
            data:{
                text: req.body.text,
                postId:req.body.postId,
                createdById: req.user.id
            }
        })
        res.status(200).json({comment})
    }catch(e){
        console.log(e)
    }
});

router.put('/comment/:uuid',
        checkuser, async (req, res)=>{
            try{
                const comment = await db.comment.update({
                    where:{
                        id: req.params.uuid
                    },
                    data:{
                        text: req.body.text
                    }
                })
                res.status(200).json({comment})            
            }catch(e){
                console.log(e)
            }
});

router.delete('/comment/:uuid', checkuser, async (req, res)=>{
    try{
    const comment = await db.comment.update({
        where:{
            id: req.params.uuid
        },
        data:{
            isDeleted: true
        }
    })
    res.status(200).json({comment})
    
    }catch(e){
        console.log(e)
    }

});

export default router;