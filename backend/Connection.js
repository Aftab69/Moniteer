const mongoose = require("mongoose");

const DB = process.env.DB;
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection successful")
}).catch((error)=>{
    console.log(error)
})

module.exports = mongoose;