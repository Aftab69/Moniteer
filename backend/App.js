const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path:"./config.env" });
require("./Connection");
app.use(require("./Routing"));
require("./Model");


app.listen(process.env.PORT,(req,res)=>{
    console.log(`app is running at ${process.env.PORT}`)
});