const express = require("express");
const router = express.Router();
const User = require("./Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get("/home",async(req,res)=>{
    const data = await User.find();
    res.send(data);
})

router.get("/available",async(req,res)=>{
    const onlinemembers = await User.find({onlinestatus:"on"});
    res.send(onlinemembers);
})

router.get("/profile",async(req,res)=>{
    try{
        const verifiedToken = jwt.verify(req.cookies.jwtoken,process.env.PRIVATEKEY);
        const userData = await User.findOne({_id:verifiedToken._id})
        if(userData){
            res.status(200).send(userData);
        } else {
            res.status(400).json({"message":"User unauthorised"})
        }
    } catch(error){
            res.status(400).json({"message":"User unauthorised"})
    }
})

router.post("/register",async(req,res)=>{
    try{
        const { name, email, password, cpassword } = req.body;
        if(!name || !email || !password || !cpassword){
            res.status(400).json({"message":"Please fill your form"})
        }
        const userExist = await User.findOne({email:email});
        if(userExist){
            res.status(401).json({"message":"Email already exists"})
        } else if(password!==cpassword){
            res.status(402).json({"message":"The password confirmation does not match"})
        } else {
            const newUser = new User({name,email,password,cpassword});
            newUser.password =await bcrypt.hash(newUser.password,12);
            newUser.cpassword =await bcrypt.hash(newUser.cpassword,12);
            await newUser.save();
            res.status(200).json({"message":"User successfully registered"});
        }
    }catch(error){
        console.log(error)
    }  
})

router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;
        if(!email || !password){
            res.status(400).json({"message":"Please fill your form"})
        }
        const userExist = await User.findOne({email:email});
        if(!userExist){
            res.status(401).json({"message":"Invalid credentials"})
        }
        const passwordMatched =await bcrypt.compare(password,userExist.password);
        if(!passwordMatched){
            res.status(401).json({"message":"Invalid credentials"})
        } else if(passwordMatched){
            const token = jwt.sign({_id:userExist._id},process.env.PRIVATEKEY);
            userExist.tokens.push({token: token});
            userExist.save();
            res.cookie("jwtoken",token);
            res.status(200).json({"message":"User successfully logged in"})
        }
    }catch(error){
        console.log(error)
    }
})

router.post("/offline", async(req,res)=>{
    try{
        const { email, onlinestatus, toggleofftime, date } = req.body;
        // console.log(req.body)
        const userExist = await User.findOne({email:email});
        userExist.onlinestatus = onlinestatus;

        // for (let i = 0; i < userExist.timeinfo.length; i++) {
        //     console.log(userExist.timeinfo[i].date) ;
        //   }

        // userExist.timeinfo.push({toggleofftime:Number(toggleontime),date:date});
        userExist.save();
        res.status(200).send({"message":"user is online"})
    } catch(error){
        console.log(error);
    }
})

router.post("/online", async(req,res)=>{
    try{
        const { email, onlinestatus, toggleontime, date } = req.body;
        // console.log(req.body)
        const userExist = await User.findOne({email:email});
        userExist.onlinestatus = onlinestatus;

        //if online for first time
        if(userExist.timeinfo.length===0){
            userExist.timeinfo.push({toggleontime:Number(toggleontime),date:date});
        } else {
            //calculating if the date when the button is clicked is already present or not
            let datenotfound = 0;

            for (let i = 0; i < userExist.timeinfo.length; i++) {
            //if date already exists
            if(userExist.timeinfo[i].date===date){
                userExist.timeinfo[i].toggleontime = Number(toggleontime);
            } else {
                datenotfound++;
            }
          }
            //if no particular date is found in data
          if(datenotfound===userExist.timeinfo.length){
            userExist.timeinfo.push({toggleontime:Number(toggleontime),date:date});
          }
        }
 
        userExist.save();
        res.status(200).send({"message":"user is online"})
    } catch(error){
        console.log(error);
    }
})

module.exports = router;