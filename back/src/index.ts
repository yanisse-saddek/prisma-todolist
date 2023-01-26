import express from "express" 
import * as dotenv from "dotenv"
import config from "./config";
import db from "./db";
import post from "./routes/posts";
import comments from "./routes/comments";
import admin from "./routes/admin";
import { protect, protectAdmin } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import cors from "cors"


dotenv.config() 

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api', protect, [post, comments])
app.use('/api/admin', protectAdmin, admin)

app.post('/signup', createNewUser)
app.post('/sign-in', signIn)


app.listen(config.port, () => {
    console.log('Server started on port', config.port);
});  

