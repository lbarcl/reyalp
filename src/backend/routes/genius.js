const router = require('express').Router()
const encodeurl = require('encodeurl')
const cheerio = require('cheerio')
const axios = require('axios')

router.get('/lyrics', async (req, res) => {
    if (!req.query.q) return res.status(400).send('You need to send query for search')
    try {
        const response = await axios.get(`https://api.genius.com/search?q=${encodeurl(req.query.q)}`, { headers: { "Authorization": `Bearer nEkoa5hvUWcscXor9utBB8wt6EDXTknzS5lmSjmzmJRNNqPfxLXmbzb7_GzTwZC9` } })
    
        if (response.data.response.hits.length == 0) return res.sendStatus(404)
        const lyric = await fetchLyric('https://genius.com' + response.data.response.hits[0].result.path)
        
        if (typeof (lyrics) == 'number') res.sendStatus(lyric)
        else res.send(lyric)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

async function fetchLyric(url) {
    try {
        const page = await axios.get(url)
        const $ = cheerio.load(page.data)
        return $('div [class="lyrics"]').html()
    } catch (error) {
        return 500
        console.log(error)
    }
}

module.exports = router