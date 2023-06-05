const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Institutes, Sequelize, Classes, Roles, Students, Grades, Subjects, ClassPrograms } = require('../models');

const { sign, verify } = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())

let refreshTokens = []

router.post('/login', async (req, res) => {

    let { email, pwd } = req.body

    console.log('Student: ' + email + ': ' + pwd)

    const student = await Students.findOne({
        where: { email: email }
    })

    console.log(student)

    if (!student) {
        res.status(401).send('There are no users associated with the email you have typed.').end()
    } else {
        bcrypt.compare(pwd, student.pwd).then((match) => {
            if (!match) {
                res.status(401).send('Wrong combination of email and password.').end()
            } else {
                const accessToken = sign({ 
                    userId: student.id,
                    roleId: 5
                }, "access", { expiresIn: '30s'})

                const refreshToken = sign({
                    userId: student.id,
                    roleId: 5
                }, "refresh", { expiresIn: '7d'})

                refreshTokens.push(refreshToken)

                return res.status(200).send({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }).end()
            }
        })
        }
})

router.post('/refresh', async (req, res) => {

    const { refreshToken } = req.body
    if (refreshToken) {
        try {
            // Verify the refresh token
            const decoded = verify(refreshToken, "refresh");
            // Check if the user exists
            const user = await Students.findOne({ where: { id: decoded.userId }});
            console.log(user)
            if (!user) {
                res.status(401).send('User not found.').end();
            }
        
            // Generate a new access token
            const accessToken = sign({ userId: user.id, roleId: 5 }, "access", {
                expiresIn: '30s', // Set the expiry time for the new access token
            });
        
            return res.status(200).send(accessToken).end()
        } catch (error) {
            console.error(error);
            return res.status(401).send("Invalid refresh token.").end();
        } 
    } else {
        return res.status(401).send("Absent refresh token. Unable to refresh the access token.").end();
    }
})

router.get('/check', validateToken, async (req, res) => {
    console.log('User id from middleware: ' + req.userId)
    if (req.userId) {
        const user = await Students.findOne({ where: { id: req.userId} }, {
            returning: true,
            plain: true
        })
        return res.status(200).send({...user, RoleId: 5}).end()
    } else {
        return res.status(400).send(req.error).end()
    }
})

router.get('/all/:id', async (req, res) => {

    let id = req.params.id

    let data = await Students.findAll({ where: { ClassId: id }, attributes: ["id", "first_name", "last_name", "ClassId"]}, )

    data != null && res.status(200).send(data).end()
    data == null && res.status(400).send("No students assign to given class id.").end()

})

router.post('/add', async (req, res) => {

    let { firstName, lastName, email, pwd, phoneNumber, instituteId, classId } = req.body

    try {
        await bcrypt.genSalt(10,  (err, salt) => {
            bcrypt.hash(pwd, salt, async (err, hash) => {
                await Students.create({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    pwd: hash,
                    phone_number: phoneNumber,
                    InstituteId: instituteId,
                    ClassId: classId
                })
            })
        })

        res.status(200).send("Student added succesfully.").end()
    } catch(err) {
        res.status(400).send(err).end()
    }

})

router.get('/byId/:id', async (req, res) => {
    let id = req.params.id
    try {
        let data = await Students.findOne({ where: { id: id }, include: [ Institutes ]})
        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send("No student have been found with the given id.").end()
    }
})

router.put('/update', async (req, res) => {

    let { studentId, firstName, lastName, email, pwd, phoneNumber } = req.body

    try {
        await Students.update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            pwd: pwd
        }, {
            where: { id: studentId }
        })

        res.status(200).send('Record updated succesfully').end()
    } catch(err) {
        res.status(400).send('An error has occured.').end()
    }
})

router.put('/editName', async (req, res) => {
    let data = req.body

    try {
        await Students.update({
            first_name: data.first_name,
            last_name: data.last_name
        }, {
            where: { id: data.id }
        })
    } catch (err) {
        res.status(400).send(err).end()
    } finally {
        res.status(200).send('Updated succesfully').end()
    }
})
router.put('/editEmail', async (req, res) => {
    let data = req.body

    try {
        await Students.update({
            email: data.email
        }, {
            where: { id: data.id }
        })
    } catch (err) {
        res.status(400).send(err).end()
    } finally {
        res.status(200).send('Updated succesfully').end()
    }
})
router.put('/editPwd', async (req, res) => {
    let data = req.body

    try {
        await Students.update({
            email: data.email
        }, {
            where: { id: data.id }
        })
    } catch (err) {
        res.status(400).send(err).end()
    } finally {
        res.status(200).send('Updated succesfully').end()
    }
})

router.put('/edit-pwd', validateToken, async (req, res) => {
    const data = req.body
    const user = await Students.findOne({ where: {id: req.userId} })


    bcrypt.compare(data.current_pwd, user.pwd).then(async (match) => {
        if (!match) {
            res.status(400).send("The current password is not valid.").end()
        } else {
            const salt = await bcrypt.genSalt(10)
            await bcrypt.hash(data.new_pwd, salt).then(async (hash) => {
                await Students.update({ pwd: hash}, {where: {id: req.userId}})
                res.status(200).send("The password have been updated succesfully.").end()
            })
        }
    })
})



router.get('/overall-grades/:userId', async (req, res) => {
    try {
        const response = await Grades.findAll({ where: { StudentId: req.params.userId }, include: [ Subjects, ClassPrograms ]})
        res.status(200).send(response).end()
    } catch (err) {
        res.status(400).send('Internal server error').end()
    }

})



module.exports = router