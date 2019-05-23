require("./db/mongoose")
const Profiles = require("./models/profiles")

/* Profiles.findByIdAndUpdate({
    _id: "5ce4ba11f845f15892c3a0d6" 
}, {
    graduate: true
}).then(result => {
    console.log(result);
    return Profiles.countDocuments({
        graduate: true
    })
}).then(result => console.log(result)
).catch(e => console.log(e))  */

/* const updateRecord = async (id) => {
    await Profiles.findByIdAndUpdate({
        _id: id
    }, {
        graduate: false,
    })
    const count = await Profiles.countDocuments({
        graduate: false,
    })

    console.log(count)
}

updateRecord("5ce4ba11f845f15892c3a0d6") */

const updateRecord = async (id, cr) => {
    try {
        const profile = await Profiles.findByIdAndUpdate(id, cr)
        console.log(profile)
        if(!profile){
            throw Error("User id doesnot exist")
        }
        const count = await Profiles.countDocuments(cr)
        console.log(count)
    }
    catch(e){
        console.log(e)
    }
}
updateRecord({
    _id: "5ce4ba11f845f15892c3a0d6" 
}, {
    graduate: true
})

/* const addnumber = (a, b) => {
    const fail = Math.floor(Math.random() * 4) === 3
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(!fail){
                res(a +b)
            }
            else {
                rej("Reject")
            }
        }, 2000)
    })
}

const showSum = async (a, b) => {
    const sum = await addnumber(a, b)
    const sum1 = await addnumber(sum, 4)
    const sum2 = await addnumber(sum1,10)
    return sum2;
}

showSum(2,2)
.then(result => console.log(result))
.catch(e => console.log(e)) */


/* addnumber(1,1).then(result => {
    console.log(result)
    return addnumber(result, 2)
}).then(result => {
    console.log(result)
    return addnumber(result, 2)
}).then(result => console.log(result)).catch(e => console.log(e)) */