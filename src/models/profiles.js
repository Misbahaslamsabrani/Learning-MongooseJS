const mongoose = require("mongoose");
const validator = require("validator");

const Profiles = mongoose.model("Profile", {
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age must be positive number")
            }
        }
    },
    graduate: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    }
})

module.exports = Profiles;