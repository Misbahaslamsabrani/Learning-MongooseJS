require("./db/mongoose");
const express = require("express");
const routes = require("./routers/profile-routes")


const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(routes)


/* const newRec = Profiles({
    name: "Misbah",
    age: 23,
    graduate: false,
    email: "misbah@gmail.com"
})

newRec.save().then(result => console.log(result)).catch(e => console.log(e)) */



app.listen(port, () => {
    console.log("Server is up on port " + port)
})