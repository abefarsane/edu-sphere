const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Institutes, Sequelize, Classes, Roles, Students, Grades, Subjects, ClassPrograms } = require('../models');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())


router.get('/byClassIdSubjectId/:classId/:subjectId', async (req, res) => {
    try {
        let data = await Grades.findAll({
            where: {
                ClassId: req.params.classId,
                SubjectId: req.params.subjectId
            }
        })
        console.log(data)
        res.status(200).send(data).end()
    } catch (err) {
        res.status(400).send('Error').end()
    }
})

router.get('/byProgramSubjectClassIds/:programId/:subjectId/:classId', async (req, res) => {
    try {
        let grades = await Grades.findAll({
            where: {
                ClassId: req.params.classId,
                SubjectId: req.params.subjectId,
                ClassProgramId: req.params.programId
            }
        })

        let students = await Students.findAll({
            where: { ClassId: req.params.classId}
        })

        const mergedArray = students.map(student => {
            const studentGrades = grades.filter(grade => grade.StudentId === student.id);
          
            const gradesArray = studentGrades.map(grade => ({ gradeId: grade.id, value: grade.value }));

          
            const emptyGrades = Array(4 - gradesArray.length).fill({ gradeId: null, value: null });
          
            return {
                subjectId: parseInt(req.params.subjectId),
                classId: parseInt(req.params.classId),
                programId: parseInt(req.params.programId),
                studentId: student.id,
                firstName: student.first_name,
                lastName: student.last_name,
                grades: [...gradesArray, ...emptyGrades]
            };
        });


        res.status(200).send(mergedArray).end()
    } catch (err) {
        res.status(400).send('Error').end()
    }
})


router.post('/addOrUpdate', async (req, res) => {
    let data = req.body

    let classId = data[0]?.classId
    let programId = data[0]?.programId
    let subjectId = data[0]?.subjectId


    try {
        await data?.map((x, key) => {
            let studentId = x.studentId

            x.grades.map(async (e, key) => {
                let isEmptyGrade = e.gradeId == null && e.value == null
                if (!isEmptyGrade) {
                    let check = await Grades.findOne({
                        where: {
                            id: e.gradeId
                        }
                    })
                    if (check != null) {
                        await Grades.update({
                            value: e.value
                        }, {
                            where: { id: e.gradeId}
                        })
                    } else {
                        await Grades.create({
                            value: e.value,
                            StudentId: studentId,
                            ClassProgramId: programId,
                            ClassId: classId,
                            SubjectId: subjectId,
                            description: e?.description || ''
                        })
                    }
                }
            })
        })


        res.status(200).send('The grades have been upgraded!').end()
    } catch (err) {
        res.status(400).send(err).end()
    }
})


router.get('/all/:studentId', async (req, res) => {
    try {
        let response = await Grades.findAll({
            where: { StudentId: req.params.studentId },
            include: [ Subjects, ClassPrograms ]
        })

        res.status(200).send(response).end()
    } catch(err) {
        res.status(400).send(err).end()
    }
})


module.exports = router