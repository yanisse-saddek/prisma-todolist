import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV  || "development"

const stage = process.env.STAGE || "local"

var envConfig;

if(stage==="production"){
    envConfig = require("./production").default;
}else{
    envConfig = require("./local").default;
}

export default merge({
    stage,
    env:process.env.NODE_ENV,
    port:3001,
    secrets:{
        jwt:process.env.JWT_SECRET,
        db_url:process.env.DATABASE_URL
    }
}, envConfig);