import express from "express" 
import * as dotenv from "dotenv"
import db from "./db";
import todoList from "./routes/todoList";
import todoItems from "./routes/todoItems";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

dotenv.config() 

const app = express();
app.use(express.json());

app.use('/api', protect, [todoList, todoItems])

app.post('/signup', createNewUser)
app.post('/sign-in', signIn)


app.listen(3000, () => {
    console.log('Server started on port 3000');
});  

