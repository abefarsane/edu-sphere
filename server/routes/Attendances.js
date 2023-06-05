const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Institutes, Sequelize, Classes, Roles, Students, Attendances } = require('../models');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())

router.post('/markOrUpdate/:classId', async (req, res) => {

    let data = req.body


    
    let message = "Submitted succesfully!"
    try {

        data.map(async (x, key) => {
            let check = await Attendances.findOne({
                where: { StudentId: x.id, date: x.date }
            })
            console.log(x.date)
            console.log(check)
            if (check == null) {
                await Attendances.create({
                    StudentId: x.id,
                    ClassId: req.params.classId,
                    date: x.date,
                    type: x.isPresent
                })
            } else {
                await Attendances.update({
                    type: x.isPresent
                }, {
                    where: {
                        StudentId: x.id,
                        date: x.date
                    }
                })
                message = "Updated succesfully!"
            }
        })

        res.status(200).send(message).end()

    } catch(err) {
        res.status(400).send('Error.').end()
    }

})


module.exports = router