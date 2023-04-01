const express = require("express");
const router = express.Router();
const User = require("./Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get("/authenticate",async(req,res)=>{
    try{
        const verifiedToken = jwt.verify(req.cookies.jwtoken,process.env.PRIVATEKEY);
        const data = await User.findOne({_id:verifiedToken._id,role:"admin"})
        if(data){
            res.status(200).send(data);
        } else {
            res.status(400).json({"message":"User unauthorised"})
        }
    } catch(error){
            res.status(400).json({"message":"User unauthorised"})
    }
})

router.get("/home",async(req,res)=>{
    const data = await User.find();
    res.status(201).send(data);
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
        const { name, email, password, cpassword, role, company } = req.body;
        if(!name || !email || !password || !cpassword || !role || !company){
            res.status(400).json({"message":"Please fill your form"})
        }
        const userExist = await User.findOne({email:email});
        let adminExist;
        if(role==="admin"){
            adminExist = await User.findOne({role:"admin",company:company})
        }
        // console.log(adminExist);
        if(userExist){
            res.status(401).json({"message":"Email already exists"})
        } else if(password!==cpassword){
            res.status(402).json({"message":"The password confirmation does not match"})
        } else if(adminExist){
                res.status(403).json({"message":"Admin already exists"})
        } else {
            const newUser = new User({name,email,password,cpassword,role,company});
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

        //calculating if the date when the button is clicked is already present or not
        let datenotfound = 0;

        for (let i = 0; i < userExist.timeinfo.length; i++) {
            if(userExist.timeinfo[i].date===date && userExist.timeinfo[i].toggleontime!==0){
                userExist.timeinfo[i].toggleofftime = toggleofftime
                userExist.timeinfo[i].activity.push({statuscheck:"offline",statustime:toggleofftime})
                if(userExist.timeinfo[i].totaltime >=0){
                    userExist.timeinfo[i].totaltime = Number(userExist.timeinfo[i].totaltime) + Number(toggleofftime) - Number(userExist.timeinfo[i].toggleontime)
                } else {
                    userExist.timeinfo[i].totaltime = 0 + Number(toggleofftime) - Number(userExist.timeinfo[i].toggleontime)
                }
                
                userExist.timeinfo[i].toggleofftime = 0;
                userExist.timeinfo[i].toggleontime = 0;
            } else if(userExist.timeinfo[i].date!==date){
               datenotfound++;
            }
          }

          //if the date of toggling off is on the next date
          if(datenotfound===userExist.timeinfo.length){
            //adding time for previous day
            if(userExist.timeinfo[userExist.timeinfo.length-1].totaltime >=0){
                userExist.timeinfo[userExist.timeinfo.length-1].totaltime = Number(userExist.timeinfo[userExist.timeinfo.length-1].totaltime) + 86400 - Number(userExist.timeinfo[userExist.timeinfo.length-1].toggleontime)
            } else {
                userExist.timeinfo[userExist.timeinfo.length-1].totaltime = 0 + 86400 - Number(userExist.timeinfo[userExist.timeinfo.length-1].toggleontime)
            }
            userExist.timeinfo[userExist.timeinfo.length-1].toggleontime = 0;
            //adding time for current day
            userExist.timeinfo.push({toggleontime:0,toggleofftime:0,date:date,totaltime:toggleofftime,activity:[{statuscheck:"offline",statustime:toggleofftime}]});

          }

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
            userExist.timeinfo.push({toggleontime:Number(toggleontime),date:date,activity:[{statuscheck:"online",statustime:toggleontime}]});
        } else {
            //calculating if the date when the button is clicked is already present or not
            let datenotfound = 0;

            for (let i = 0; i < userExist.timeinfo.length; i++) {
            //if date already exists
            if(userExist.timeinfo[i].date===date){
                
                if(userExist.timeinfo[i].toggleontime>0){
                } else {
                    userExist.timeinfo[i].toggleontime = Number(toggleontime);
                    userExist.timeinfo[i].activity.push({statuscheck:"online",statustime:toggleontime})
                }
                
            } else {
                datenotfound++;
            }
          }
            //if no particular date is found in data
          if(datenotfound===userExist.timeinfo.length){
            userExist.timeinfo.push({toggleontime:Number(toggleontime),date:date,activity:[{statuscheck:"online",statustime:toggleontime}]});
          }
        }
 
        userExist.save();
        res.status(200).send({"message":"user is online"})
    } catch(error){
        console.log(error);
    }
})

module.exports = router;