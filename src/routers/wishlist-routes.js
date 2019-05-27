const express = require("express")
const WishList = require("../models/wishlist")
const routes = express.Router();
const auth = require("../middlewares/auth");

routes.post("/wishlist", auth, async (req, res) => {
    try{
        const wish = new WishList({
            ...req.body,
            wishedBy: req.profile._id
        })

        await wish.save()
        await wish.populate('wishedBy').execPopulate();
        res.status(201).send(wish)
    }catch(e){
        res.status(500).send("Internal Server Error")
    }
})

routes.get("/wishlist/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try{
        //const wish = await WishList.findById(_id);
        const wish = await WishList.findOne({
            _id,
            wishedBy: req.profile._id
        })
        if(!wish){
            res.status(404).send("No wish list found");
        }
        
        await wish.populate('wishedBy').execPopulate();
       
        res.send(wish)
    }catch(e){
        res.status(500).send("Internal Server Error")
    }
})

routes.get("/wishlist", auth, async (req, res) => {
    try{
        /* const wishlists = await WishList.find({
            wishedBy: req.profile._id
        }) */
        const {status, limit , skip, sortAt, order} = req.query;
        const match = {}
        if(status){
            match.status = status === "true";
        }
        //console.log(match);
        
        const sort = {}
        if(sortAt) {
            sort[sortAt] = order === "desc" ? -1 : 1;
        }
        const wishlists = await req.profile.populate({
            path: "wishList",
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort
            }
        }).execPopulate();
        if(!wishlists){
            res.send(404).send("No wishes found")
        }
        res.send(wishlists)
    }catch(e){
        res.status(500).send("Internal Server Error")
    }
})

routes.delete("/wishlist/:id", async (req, res) => {
    try{
        const wish = await WishList.findOneAndDelete({
            _id: req.params.id,
            wishedBy: req.profile._id
        })
        if(!wish){
            res.status(404).send("Can't delete wish, it might already deleted")
        }
        res.send(wish, "Wish deleted Successfully");
    }catch(e){
        res.status(500).send("Internal Server Error")
    }
})

routes.patch('/wishlist/:id', auth, async (req, res) => {
    const modifiedWish = req.body
    const fieldsToUpdate = Object.keys(modifiedWish)
    const fieldsInModel = ['wish','status']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    if (!isUpdateAllowed) {
        return res.status(400).send({ error: 'Invalid fields!' })
    }
    try {
        const wish = await WishList.findOne({
            _id: req.params.id,
            wishedBy: req.profile._id
        })
        if (!wish) { return res.status(404).send() }
        Object.assign(wish, modifiedWish)
        await wish.save()
        res.send(wish)
    } catch (e) {
        res.status(400).send(e)
    }
 })
 module.exports = routes;