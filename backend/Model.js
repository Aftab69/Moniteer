const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    company: {
        type: String
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    onlinestatus:{
        type: String
    },
    timeinfo:[{
        toggleontime:{
            type: Number
        },
        toggleofftime:{
            type: Number
        },
        totaltime:{
            type: Number
        },
        date:{
            type: String
        },
        activity:[{
            statuscheck:{
                type:String
            },
            statustime:{
                type: Number
            }
        }]
    }]
})

const User = mongoose.model("user",userSchema);

module.exports = User;