const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Institutes, Sequelize, Classes, Roles, ClassPrograms, Assignments, Subjects } = require('../models');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())

router.get('/all/:id', async (req, res) => {
    let instituteId = req.params.id
    let data = await Classes.findAll({ where: { InstituteId: instituteId }})
    data != null && res.status(200).send(data).end()
    data == null && res.status(400).send('No classes to show.').end()
})

router.post('/add', async(req, res) => {

    const { name, institute } = req.body
    console.log(name, institute)

    let addClass = await Classes.create({
        name: name,
        InstituteId: institute
    })
    
    addClass.id != null && res.status(200).send('The class has been added succesfully!').end()
    addClass.id == null && res.status(400).send('There was an error during the process.').end()
})


router.get('/byId/:id', async (req, res) => {
    let id = req.params.id

    try {
        let data = await Classes.findOne({
            where: {
                id: id
            }, include: [ Institutes ]
        })

        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send('No class found with the given id.').end()
    }
})

router.get('/all-by-instituteId/:instituteId', async (req, res) => {
    try {
        const response = await Classes.findAll({ where: { InstituteId:  req.params.instituteId }})
        res.status(200).send(response).end()
    } catch (err) {
        res.status(400).send(err).end()
    }
})

router.get('/programsBySubjectIdClassId/:subjectId/:classId', async (req, res) => {

    try {
        let data = await ClassPrograms.findAll({
            where: {
                ClassId: req.params.classId,
                SubjectId: req.params.subjectId
            }
        })

        res.status(200).send(data).end()
    } catch( err) {
        res.status(400).send('Error.').end()
    }
})


router.post('/add-assignment', async (req, res) => {
    const data = req.body

    try {
        await Assignments.create({
            title: data.title,
            description: data.description,
            due_date: data.dueDate,
            type: data.type,
            ClassProgramId: data.program,
            ClassId: data.class,
            SubjectId: data.subject
        })

        res.status(200).send("The assignment has been added.")
    } catch(err) {
        res.status(400).send(err).end()
    }
})

router.get('/assignmentsById/:classId', async (req, res) => {
    const data = await Assignments.findAll({ where: { ClassId: req.params.classId }, include: [ Subjects, ClassPrograms]})
    res.status(200).send(data).end()
})

module.exports = router