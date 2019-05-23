require("./db/mongoose");
const Profiles = require("./models/profiles");
const express = require("express");
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())


/* const newRec = Profiles({
    name: "Misbah",
    age: 23,
    graduate: false,
    email: "misbah@gmail.com"
})

newRec.save().then(result => console.log(result)).catch(e => console.log(e)) */


app.post("/profiles", async (req, res) => {
        try{
            const profile = await Profiles(req.body).save()
            res.send(profile)
        }
        catch(e){
            res.status(400).send(e)
        }
})

app.get("/profiles/:id", async (req, res) => {
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

app.get("/profiles", async (req, res) => {
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

app.patch("/profiles/:id", async (req, res) => {
        const keys = Object.keys(req.body);
        const keysInModel= ["name", "age", "graduate", "email"]
        const check = keys.every(key => keysInModel.includes(key))

        if(!check){
            return res.status(400).send("Invalid field");
        }
        try{
            const user = await Profiles.findByIdAndUpdate(req.params.id, 
                req.body, { new: true, runValidators: true })
            if(!user){
                return res.status(404).send()
            }
            res.send(user)
        }catch(e){
            res.status(500).send(e)
        }   
})

app.delete("/profiles/:id", async (req, res) => {
    try{
        const user = await Profiles.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){ res.status(500).send()}
})

app.listen(port, () => {
    console.log("Server is up on port " + port)
})