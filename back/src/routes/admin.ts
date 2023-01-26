const express = require('express')
const router = express.Router()
import db from "../db"

router.delete('/post/:postid', async (req:any, res:any)=>{
    try{

        const post = await db.post.update({
            where:{
                id: req.params.postid
            },
            data:{
                isDeleted:true
            }
        })
        
        res.status(200).json({post})
    }catch(e){
        console.log(e)
    }
})

router.delete('/comment/:commentid', async (req:any, res:any)=>{
    try{
        const comment = await db.comment.update({
            where:{
                id: req.params.commentid
            },
            data:{
                isDeleted:true
            }
        })
        res.status(200).json({comment})
    }catch(e){
        console.log(e)
    }
})

export default router