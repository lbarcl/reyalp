const router = require('express').Router()
const axios = require('axios')

router.get('/spotify', async (req, res) => {
    const { id } = req.query
    try {
        const response = await axios.get(`https://freapi.tk/v1/song/spotify?id=${id}`,
        { headers: { 'Authorization': process.env.PIFREE } })
        res.send(response.data)
    } catch (error) {
        res.sendStatus(error.response.status)
        console.log(error)
    }
})

module.exports = router
