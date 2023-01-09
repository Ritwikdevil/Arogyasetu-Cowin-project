const userModel = require('../model/userModel')
const CowinModel = require('../model/vaccinModel')
const axios = require('axios')
const { default: mongoose } = require('mongoose')

const cowinVaccine = async (req, res) => {

    try {

        const data = req.body
        const { Date, Pincode } = data

        // https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=753014&date=10-01-202

        let result = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${Pincode}&date=${Date}`)

        let vData = result.data.centers

        let Dose1Total = 0
        let Dose2Total = 0
        let rets = []

        for (let i = 0; i < vData.length; i++) {
            for (let j = 0; j < vData[i].sessions.length; j++) {
                Dose1Total += vData[i].sessions[j].available_capacity_dose1
                Dose2Total += vData[i].sessions[j].available_capacity_dose2
                rets.push(vData[i].sessions[j])
                // console.log(vData[i].sessions[j])
                // console.log(vData[i].sessions[j].available_capacity_dose2)
            }
        }
        // { Dose1: Dose1Total, Dose2: Dose2Total } 
        return res.status(200).send({ status: true, message: "Done!", Data: vData })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}


const registerVaccine = async (req, res) => {

    try {

        let bodyData = req.body
        let ID = req.params.userID
        let { center_id, session_id, beneficiaries, slot, is_precaution, dose } = bodyData

        if (!mongoose.isValidObjectId(ID)) return res.status(400).send({ staus: false, message: 'Invalid ID!' })


        let getID = await userModel.findOne({ _id: ID })
        if (!getID) return res.status(400).send({ staus: false, message: 'You have to register youself first.' })

        if (dose == 1) {

            const getCowinData = await CowinModel.findOne({ ID: ID, Name: getID.Name, FirstDoseVaccination: 1 })
            if (getCowinData) return res.status(400).send({ staus: false, message: 'You already registered for First Dose!' })


            var options = {
                method: "post",
                url: `https://cdndemo-api.co-vin.in/api/v4/appointment/schedule`,
                data: bodyData
            }

            let result = await axios(options)
            // console.log(result.data)

            await CowinModel.create({ ID: ID, Name: getID.Name, FirstDoseVaccination: 1, Dose1Slot: slot, timer: Math.round(new Date().getTime() / 1000) + (24 * 60 * 60) })
            return res.status(200).send({ msg: result.data })

        }
        else if (dose == 2) {

            const getCowinData = await CowinModel.findOne({ ID: ID, Name: getID.Name, SecondDoseVaccination: 1, })
            if (getCowinData) return res.status(400).send({ staus: false, message: 'You already registered for Second Dose!' })


            var options = {
                method: "post",
                url: `https://cdndemo-api.co-vin.in/api/v4/appointment/schedule`,
                data: bodyData
            }

            let result = await axios(options)

            await CowinModel.findOneAndUpdate({ ID: ID, Name: getID.Name }, { SecondDoseVaccination: 1, Dose2Slot: slot, timer: Math.round(new Date().getTime() / 1000) + (24 * 60 * 60) })
            return res.status(200).send({ msg: result.data })

        } else {
            return res.status(400).send({ msg: 'You have put something Wrong input.' })

        }

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}


const UpdateData = async (req, res) => {

    try {

        let bodyData = req.body
        let ID = req.params.userID
        let { center_id, session_id, beneficiaries, slot, is_precaution, dose } = bodyData

        if (!mongoose.isValidObjectId(ID)) return res.status(400).send({ staus: false, message: 'Invalid ID!' })


        let getID = await userModel.findOne({ _id: ID })
        if (!getID) return res.status(400).send({ staus: false, message: 'You have to register youself first.' })

        const getCowinData = await CowinModel.findOne({ ID: ID, Name: getID.Name })
        if (!getCowinData) return res.status(400).send({ staus: false, message: 'You have no data!' })

        if (getCowinData.timer < Math.round(new Date().getTime() / 1000)) return res.status(400).send({ staus: false, message: "You can't update your time slot now after 24hr!" })

        if (dose == 1) {

            let update = await CowinModel.findOneAndUpdate({ ID: ID, Name: getID.Name }, { Dose1Slot: slot }, { new: true })
            return res.status(200).send({ msg: 'Update Sucessfully.', Data: update })

        }

        else if (dose == 2) {

            let update = await CowinModel.findOneAndUpdate({ ID: ID, Name: getID.Name }, { Dose2Slot: slot }, { new: true })
            return res.status(200).send({ msg: 'Update Sucessfully.', Data: update })

        } else {
            return res.status(400).send({ msg: 'You have put something Wrong input.' })
        }

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}



const GetAllVaccineData = async (req, res) => {

    try {
        let ID = req.params.userID

        if (!mongoose.isValidObjectId(ID)) return res.status(400).send({ staus: false, message: 'Invalid ID!' })

        let getID = await userModel.findOne({ _id: ID })
        if (!getID) return res.status(400).send({ staus: false, message: 'You have to register youself first.' })

        const getCowinData = await CowinModel.findOne({ ID: ID, Name: getID.Name })
        if (!getCowinData) return res.status(400).send({ staus: false, message: 'You have no data!' })

        return res.status(200).send({ status: true, Data: getCowinData })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }
}














module.exports = { cowinVaccine, registerVaccine, UpdateData, GetAllVaccineData }