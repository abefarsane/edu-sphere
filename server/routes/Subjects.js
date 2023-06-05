const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Institutes, Sequelize, Classes, Roles, Students, Subjects, ClassPrograms } = require('../models');

var bodyParser = require('body-parser');
const { route } = require('./Classes');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())

router.get('/all/:id', async (req, res) => {
    let instituteId = req.params.id
    try {
        let data = await Subjects.findAll({ where: { InstituteId: instituteId}})
        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send(err).end()
    }
})

router.post('/add', async (req, res) => {
    let { name, instituteId, description } = req.body
    try {
        await Subjects.create({
            name: name, 
            InstituteId: instituteId,
            description: description
        })
        res.status(200).send(`${name} has been added.`).end()
    } catch(err) {
        res.status(400).send(err).end()
    }
})

router.get('/byClassId/:id', async (req, res) => {
    let classId = req.params.id
    try {
        let data = await ClassPrograms.findAll({ where: { ClassId: classId }, include: [Subjects]})
        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send(err).end()
    }
})
router.get('/byInstituteId/:id', async (req, res) => {
    let instituteId = req.params.id
    try {
        let data = await Subjects.findAll({ where: { InstituteId: instituteId }})
        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send(err).end()
    }
})

router.post('/addByClassId/:id', (req, res) => {
    let classId = req.params.id
    let data = req.body

    try {
        data.map(async (x) => {
            await ClassPrograms.create({
                period_title: x.periodTitle,
                date_from: x.dateFrom,
                date_to: x.dateTo,
                notes: x.notes,
                ClassId: classId,
                SubjectId: x.subjectSelected
            })
        })
        res.status(200).send('Updated succesfully.').end()
    } catch (err) {
        res.status(400).send(err).end()
    }
})
router.get('/byClassId&SubjectId/:classId/:subjectId', async(req, res) => {
    try{
        let data = await ClassPrograms.findAll({
            where: {
                ClassId: req.params.classId,
                SubjectId: req.params.subjectId
            },
            include: [ Subjects ]
        })
        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send('No programs to show').end()
    }
})
router.delete('/byProgramId/:id', async (req, res) => {
    try {
        await ClassPrograms.destroy({
            where: { id: req.params.id}
        })
        res.status(200).send('Deleted succsfully!').end()
    } catch(err) {
        res.status(400).send('Record already deleted.').end()
    }
})
router.post('/addOrUpdateByClassId/:id', (req, res) => {
    let data = req.body
    let classId = req.params.id


    data.map(async (x) => {
        x.id == '' ? (
            await ClassPrograms.create({
                ClassId: classId,
                SubjectId: x.SubjectId,
                date_from: x.date_from,
                date_to: x.date_to,
                notes: x.notes,
                period_title: x.period_title
            })
        ) : (
            await ClassPrograms.update({
                period_title: x.period_title,
                date_from: x.date_from,
                date_to: x.date_to,
                notes: x.notes
            },
            {
                where: { id: x.id}
            })
        )
    })

    res.status(200).end()
})


module.exports = router