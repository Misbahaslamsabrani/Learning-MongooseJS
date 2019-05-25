const jwt = require('jsonwebtoken')
const Profiles = require('../models/profiles')

const auth = async (req, res, next) => {
   try {
       const token = req.header('Authorization').replace('Bearer ', '')
       const decoded_token = jwt.verify(token, 'thisIsMySecretKey')
       const profile = await Profiles.findOne({
            _id: decoded_token._id, 
            'tokens.token': token 
        })

       if (!profile) {
           throw new Error()
       }
	    req.token = token
        req.profile = profile
       next()
   } catch (e) {
       res.status(401).send({ error: 'Please login first.' })
   }
}
module.exports = auth
