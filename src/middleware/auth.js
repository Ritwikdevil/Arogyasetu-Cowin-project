//===================== Importing Module and Packages =====================//
const JWT = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const userModel = require('../model/userModel')

//<<<===================== This function used for Authentication =====================>>>//
const Authentication = async (req, res, next) => {
    try {

        //===================== Check Presence of Key with Value in Header =====================//
        let token = req.headers['authorization']
        if (!token) { return res.status(400).send({ status: false, message: "Token must be Present." }) }
        token = token.slice(7)
        //===================== Verify token & asigning it's value in request body =====================//
        JWT.verify(token, "Secret-Key-147258369", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, message: "Invalid Token." })
            } else {
                req.token = decodedToken
                next()
            }
        })

    } catch (error) {

        res.status(500).send({ status: false, error: error.message })
    }
}


//<<<=====================This function used for Authorisation(Phase II)=====================>>>//
const Authorization = async (req, res, next) => {

    try {

        //===================== Authorising with userId From Param =====================//
        let userId = req.params.userID

        //===================== Checking the userId is Valid or Not by Mongoose =====================//
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: `This UserId: ${userId} is not valid!` })

        //===================== Fetching All User Data from DB =====================//
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "You have to register youself first." })

        //x===================== Checking the userId is Authorized Person or Not =====================x//
        if (userData['_id'].toString() !== req.token.payload.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized User Access!" })
        }

        next()

    } catch (error) {

        res.status(500).send({ status: false, error: error.message })
    }
}



//================================= Module Export ==============================================//

module.exports = { Authentication, Authorization }