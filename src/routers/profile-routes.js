const express = require("express")
const Profiles = require("../models/profiles");
const routes = express.Router()

routes.post("/profiles", async (req, res) => {
        try{
            const profile = await Profiles(req.body).save()
            res.send(profile)
        }
        catch(e){
            res.status(400).send(e)
        }
})

routes.get("/profiles/:id", async (req, res) => {
    const _id = req.params.id
    console.log(_id)
    try{
        const user = await Profiles.findById(_id)
        if(!user){
            res.status(404).send("No user found")
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

routes.get("/profiles", async (req, res) => {
    try {
        const profiles = await Profiles.find({})
        if(!profiles){
            res.status(404)
        }
        res.send(profiles)
    }catch(e){
        res.status(500).send(e)
    }
})

routes.patch("/profiles/:id", async (req, res) => {
        const updateData = req.body;
        const keys = Object.keys(updateData);
        const keysInModel= ["name", "age", "graduate", "email", "password"]
        const check = keys.every(key => keysInModel.includes(key))

        if(!check){
            return res.status(400).send("Invalid field");
        }
        try{
            //const user = await Profiles.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            const user = await Profiles.findById(req.params.id)
            if(!user){
                return res.status(404).send("can't update user data, may be this user is already deleted")
            }
            //new amd old data mila ke save kardiya manually!
            Object.assign(user, updateData);
            await user.save();

            res.send(user);
        }catch(e){
            res.status(500).send("internal server error");
        }   
})

routes.delete("/profiles/:id", async (req, res) => {
    try{
        const user = await Profiles.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){ res.status(500).send()}
})

module.exports = routes;