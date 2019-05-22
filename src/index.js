require("./db/mongoose");
const Profiles = require("./models/profiles");

const newRec = Profiles({
    name: "Misbah",
    age: 23,
    graduate: false,
    email: "misbah@gmail.com"
})

newRec.save().then(result => console.log(result)).catch(e => console.log(e))