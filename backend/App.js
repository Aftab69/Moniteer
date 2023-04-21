const express = require("express");
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin: ['https://moniteer.infinityymedia.com','http://localhost:3000'],
    credentials: true
  }));
const dotenv = require("dotenv");
dotenv.config({ path:"./config.env" });
require("./Connection");
app.use(require("./Routing"));
require("./Model");


app.listen(process.env.PORT,(req,res)=>{
    console.log(`app is running at ${process.env.PORT}`)
});