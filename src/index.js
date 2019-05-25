require("./db/mongoose");
const express = require("express");
const routes = require("./routers/profile-routes")


const app = express()
const port = process.env.PORT || 3000;

/* app.use((req, res, next) => {
    res.status(503).send("Site is currently down. Check back soon!")
    next()
}) */

/* app.use((req,res, next) => {
    if(req.method === "DELETE"){
        res.status(503).send("DELETE requests are disabled")
    }
    else{
        next();
    }
}) */

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