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


app.post("/profiles", (req, res) => {
    const profile = Profiles(req.body)
    profile.save().then(() => {
        res.send(profile)
    }).catch((e) => {
        res.status(400)
        res.send(e)
    })
})

app.get("/profiles/:id", (req, res) => {
    const _id = req.params.id
    console.log(_id)
    Profiles.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.listen(port, () => {
    console.log("Server is up on port " + port)
})