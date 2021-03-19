const router = require('express').Router()

module.exports = router

router.use('/users', require('./users'))
router.use('/recordings', require('./recordings'))
router.use('/predictions', require('./predictions'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
