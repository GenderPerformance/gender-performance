const router = require('express').Router()
const {User, Recording} = require('../db/models')
const fs = require('fs')
const path = require('path')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/recordings', async (req, res, next) => {
  try {
    const recordings = await Recording.findAll({
      where: {
        userId: req.params.userId
      },
      order: [['createdAt', 'DESC']]
    })

    res.send(recordings)
  } catch (err) {
    console.error(err)
  }
})
