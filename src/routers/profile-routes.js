const express = require("express")
const Profiles = require("../models/profiles");
const auth = require("../middlewares/auth");

const routes = express.Router()

routes.post("/profiles", async (req, res) => {
    try {
        const profile = await Profiles(req.body).save()
        const token = await profile.generateAuthToken()
        res.status(201).send({ profile, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

routes.get("/profiles/myprofile", auth, async (req, res) => {
    //const id = req.params.id

    try {
        
        //const user = await Profiles.findById(id)
        const user = req.profile; 
        /* if (user._id.toString() !== id) {
            res.status(404).send("No user found")
        } */
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.get("/profiles", auth, async (req, res) => {
    try {
        const profiles = await Profiles.find({})
        if (!profiles) {
            res.status(404)
        }
        res.send(profiles)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.patch("/profiles/myprofile", auth, async (req, res) => {
    const updateData = req.body;
    const keys = Object.keys(updateData);
    const keysInModel = ["name", "age", "graduate", "email", "password"]
    const check = keys.every(key => keysInModel.includes(key))
    if (!check) {
        return res.status(400).send("Invalid field");
    }
    try {
        //const user = await Profiles.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        /* const user = await Profiles.findById(req.params.id)
        if (!user) {
            return res.status(404).send("can't update user data, may be this user is already deleted")
        } */
        const user = req.profile;
        //new amd old data mila ke save kardiya manually!
        Object.assign(user, updateData);
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(500).send("internal server error");
    }
})

routes.delete("/profiles/myprofile", auth,  async (req, res) => {
    try {
        
        /* const user = await Profiles.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send()
        } */

        await req.profile.remove()
        res.send(req.profile)
    } catch (e) { res.status(500).send() }
})


routes.post("/profiles/login", async (req, res) => {
    try {
        const user = await Profiles.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) { res.status(500).send("server error") }
})

routes.post("/profiles/logout", auth, async(req, res) => {
    try{
        const {token , profile} = req;
        profile.tokens = profile.tokens.filter(t => t.token !== token)

        await profile.save();
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

module.exports = routes;