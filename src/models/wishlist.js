const mongoose = require("mongoose");

const wishListScehma = new mongoose.Schema({
    wish: {
        type: String,
        required: true,
    },
    wishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    status: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

const wishList = mongoose.model("WishList", wishListScehma)

module.exports = wishList;