const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const WishList = require("./wishlist");

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
    },
    tokens: [{
        token:{
            type: String,
            required: true,
        }
    }]
}, { 
    toObject: {
        virtuals: true 
    },
    timestamps: true,
})

profileSchema.virtual('wishList', {
    ref: 'WishList',
    localField: '_id',
    foreignField: 'wishedBy'
 })
 
profileSchema.pre("remove", async function(next){
    const profile = this
    await WishList.deleteMany({
        wishedBy: profile._id
    })
    next();
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

profileSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    },
    "thisIsMySecretKey")

    user.tokens = user.tokens.concat({
        token
    })
    await user.save()

    return token;
}

profileSchema.methods.toJSON = function(){
    const profile = this;
    const publicData = profile.toObject();

    delete publicData.password;
    delete publicData.tokens;

    console.log(publicData);

    return publicData
}

profileSchema.statics.toJSON = (profiles) => {
    const publicData = profiles.map(p => {
        const temObj = p.toObject();
        delete temObj.password;
        delete temObj.tokens;
        return temObj;
    })
    return publicData;
}

const Profiles = mongoose.model("Profile", profileSchema)

module.exports = Profiles;