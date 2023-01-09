const express = require("express")
const router = express.Router();
const { createUser, loginUser } = require('../controller/userController')
const { cowinVaccine, registerVaccine, UpdateData, GetAllVaccineData } = require('../controller/cowin')
const { Authentication, Authorization } = require('../Middleware/auth')

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)

router.post('/cowinVaccine/:userID', Authentication, Authorization, cowinVaccine)
router.post('/registerVaccine/:userID', Authentication, Authorization, registerVaccine)
router.put('/UpdateData/:userID', Authentication, Authorization, UpdateData)
router.get('/GetAllVaccineData/:userID', Authentication, Authorization, GetAllVaccineData)

router.all('*', function (req, res) {
    return res.status(404).send('Something Wrong!')
})
module.exports = router;