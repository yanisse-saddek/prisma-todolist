
# Blog NodeJS


## Installation

To use this project you need to have a NodeJS and npm/pnpm up to date 

NodeJS of 16 or higher
pnpm of 6 or higher
npm of 6 or higher

To check it use
```bash
 node --version
 pnpm --version
 npm --version
```
clone this project using the command
```bash
git clone "https://github.com/yanisse-saddek/prisma-todolist.git" 
```

Install the dependencies using the following command

```bash
  npm install 
  pnpm install
```


## Routes

Here is the list of routes usable in this application   

### Signup and Sign-in route

POST request : signup to create an account to use the blog 
```bash
/signup
```
POST request : log to your account to use the app
```bash
/sign-in
```

### Comment route

POST request : create a description to yur command 
```bash
/api/comment
```
PUT request : update the comment with the uuid
```bash
/api/comment/:uuid
```
DELETE request : delete a comment

```bash
/api/comment/:uuid
```

### Post route

GET request : get all the posts of a user
```bash
/api/posts
```
GET request : get all the posts 
```bash
/api/posts/all
```
GET request : get a single post
```bash
/api/post/:uuid
```
POST request : create a post 
```bash
/api/post
```
DELETE request : delete a post 
```bash
/api/post/:uuid
```
PUT request : update the post with the uuid
```bash
/api/post/:uuid
```
GET request : get all the post of a single user
```bash
/api/user
```

### Admin route

DELETE request : delete a post by an admin 
```bash
/api/admin/post/:postid
```
DELETE request : delete a comment by an admin 
```bash
/api/admin/comment/:commentid
```

    
