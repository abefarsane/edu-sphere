const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
app.use(bodyParser.json());//add this line


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    cors({
        credentials: true,
        methods: ["GET","POST","PUT", "DELETE"]
    })
);



const usersRouter = require('./routes/Users')
app.use("/users", usersRouter)
const institutesRouter = require('./routes/Institutes')
app.use("/institutes", institutesRouter)
const classesRouter = require('./routes/Classes')
app.use("/classes", classesRouter)
const studentsRouter = require('./routes/Students')
app.use("/students", studentsRouter)
const subjectsRouter = require('./routes/Subjects')
app.use("/subjects", subjectsRouter)
const attendanceRouter = require('./routes/Attendances')
app.use("/attendances", attendanceRouter)
const gradesRouter = require('./routes/Grades')
app.use("/grades", gradesRouter)


db.sequelize.sync()
    .then((req) => {
        app.listen(3001, () => {
            console.log("Server is running on port 3001")
        })
    })
  .catch((err) => {
    console.log(err)
})