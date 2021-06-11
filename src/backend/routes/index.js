const router = require('express').Router()

router.use('/spotify', require('./spotify'))
router.use('/apifree', require('./apifree'))
router.use('/youtube', require('./youtube'))

module.exports = router