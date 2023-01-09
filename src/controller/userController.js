const userModel = require('../model/userModel')
const JWT = require('jsonwebtoken')


const createUser = async (req, res) => {

    try {

        const data = req.body
        const { Name, PhoneNumber, Age, Pincode, AadharNumber } = data

        const createUser = await userModel.create(data)

        return res.status(201).send({ status: true, message: "Successfully User Created!", data: createUser })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}



const loginUser = async (req, res) => {

    try {

        const data = req.body
        const { PhoneNumber, Password } = data

        const getUser = await userModel.findOne(PhoneNumber)

        let payload = { userId: getUser[_id].toString(), Name: Name, PhoneNumber: PhoneNumber }

        const token = JWT.sign({ payload }, 'Secret-Key-147258369', { expiresIn: '1d' })

        return res.status(201).send({ status: true, message: " Login Successfull!", data: { Token: token, Name: Name } })

    } catch (error) {
        
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { createUser, loginUser }