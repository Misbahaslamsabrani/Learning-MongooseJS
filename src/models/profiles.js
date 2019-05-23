const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
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
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw Error("Password cannot contain word 'passwrod'")
            }
        }
    }
})
profileSchema.pre("save", async function (next) {
    const user = this;
    //console.log(user.password, "ye password hai filhal")
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    //console.log(user.password, "password after being hashed");
    next();
})

profileSchema.statics.findByCredentials = async (email, password) => {
    const user = await Profiles.findOne({ email })
    if (!user) {
        throw new Error("wrong Email!")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Wrong Password!")
    }
    return user;
}

const Profiles = mongoose.model("Profile", profileSchema)

module.exports = Profiles;