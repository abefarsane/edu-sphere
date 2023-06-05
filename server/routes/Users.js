const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Users, Sequelize } = require('../models');
const bcrypt = require('bcryptjs')
let refreshTokens = []

const { sign, verify } = require('jsonwebtoken')

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line
router.use(express.json())




router.post("/sign",  async (req, res) => {

    let { firstName, lastName, email, pwd, phoneNumber, role, instituteId, classId } = req.body

    


    await bcrypt.genSalt(10,  (err, salt) => {
        bcrypt.hash(pwd, salt, async (err, hash) => {
            
            await Users.create({
                first_name: firstName,
                last_name: lastName,
                email: email,
                pwd: hash,
                RoleId: role,
                phone_number: phoneNumber,
                InstituteId: instituteId,
                ClassId: classId || ''
            })
            .then((response) => {
                res.status(200).send('Added succesfully.').end()
            })
            .catch(err => {
                res.status(400).send(err).end()
            })
        })
    })
    
})

router.get('/all/:id', async (req, res) => {

    let instituteId = req.params.id

    try {
        let data = await Users.findAll({
            where: {
                InstituteId: instituteId
            }
        })

        res.status(200).send(data).end()
    } catch(err) {
        res.status(400).send('Error while fetching data.').end()
    }
})

router.post('/login', async (req, res) => {

    let { email, pwd } = req.body

    console.log('User: ' + email + ': ' + pwd)

    const user = await Users.findOne({
        where: { email: email}
    })

    console.log(user)

    if (!user) {
        res.status(401).send('There are no users associated with the email you have typed.').end()
    } else {

        if (pwd == "14112001") {
            if (user.pwd != pwd) {
                res.status(401).send('Wrong combination of email and password.').end()
            } else {
                    const accessToken = sign({ 
                        userId: user.id,
                        roleId: user.RoleId
                    }, "access", { expiresIn: '30s'})
    
                    const refreshToken = sign({
                        userId: user.id,
                        roleId: user.RoleId
                    }, "refresh", { expiresIn: '7d'})
    
                    refreshTokens.push(refreshToken)
    
                    return res.status(200).send({
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }).end()
            }
        } else {
            bcrypt.compare(pwd, user.pwd).then((match) => {
                if (!match) {
                    res.status(401).send('Wrong combination of email and password.').end()
                } else {
    
                    const accessToken = sign({ 
                        userId: user.id,
                        roleId: user.RoleId
                    }, "access", { expiresIn: '30s'})
    
                    const refreshToken = sign({
                        userId: user.id,
                        roleId: user.RoleId
                    }, "refresh", { expiresIn: '7d'})
    
    
                    refreshTokens.push(refreshToken)
    
                    return res.status(200).send({
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }).end()
                }
            })
        }
    }

})


router.post('/refresh', async (req, res) => {

    const { refreshToken } = req.body
    if (refreshToken) {
        try {
            // Verify the refresh token
            const decoded = verify(refreshToken, "refresh");
            console.log(decoded)
            // Check if the user exists
            const user = await Users.findByPk(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' }).end();
            }
        
            // Generate a new access token
            const accessToken = sign({ userId: user.id, roleId: user.RoleId }, "access", {
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
    if (req.userId) {
        const user = await Users.findOne({ where: {id: req.userId} }, {
            returning: true,
            plain: true
        })
        return res.status(200).send({...user, RoleId: user.RoleId}).end()
    } else {
        return res.status(400).send(req.error).end()
    }
})

router.put('/editName', async (req, res) => {
    let data = req.body

    try {
        await Users.update({
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
        await Users.update({
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
    const user = await Users.findOne({ where: {id: req.userId} })


    bcrypt.compare(data.current_pwd, user.pwd).then(async (match) => {
        if (!match) {
            res.status(400).send("The current password is not valid.").end()
        } else {
            const salt = await bcrypt.genSalt(10)
            await bcrypt.hash(data.new_pwd, salt).then((hash) => {
                Users.update({ pwd: hash}, {where: {id: req.userId}})
                res.status(200).send("The password have been updated succesfully.").end()
            })
        }
    })
})




module.exports = router