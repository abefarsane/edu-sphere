const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Institutes, Sequelize, Classes, Roles, Students } = require('../models');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())

router.get('/all', validateToken, async (req, res) => {
  if (req.error) { 
    console.log('err!')
    return res.status(400).send(req.error)
  } else if (req.roleId == 1) {
    let data = await Institutes.findAll()
    console.log(data + 'tik!')
    return res.status(200).send(data)
  } else {
    console.log(req)
    console.log('non auth!')
    return res.status(401).send('Not authorized to access this informations.')
  }
})

router.post('/add', async (req, res) => {

    const { name, address, phone_number, notes, adminId } = req.body

    try {
      await Institutes.create({
        name: name, 
        address: address,
        phone_number: phone_number,
        notes: notes || "No notes",
        adminId: adminId || null
      })

      res.status(200).send('Succesfully added.').end()
    } catch(error) {
      error.parent.code === 'ER_DUP_ENTRY' && res.status(400).send('Institute already registrated.').end()
    }

  
})

router.get('/byId/:id', async (req, res) => {

  const id = req.params.id

  let data = await Institutes.findOne({ where: { id: id }})

  data != null ? res.status(200).send(data).end() : res.status(400).send('Invalid request. Institute not found.').end()
})



module.exports = router