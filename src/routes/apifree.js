const router = require('express').Router()
const axios = require('axios')
const encodeurl = require('encodeurl')

router.get('/spotify', async (req, res) => {
    const { id } = req.query
    try {
        const response = await axios.get(`https://freapi.tk/api/song/spotify?id=${id}`,
        { headers: { 'Authorization': process.env.PIFREE } })
        res.send(response.data)
    } catch (error) {
        res.sendStatus(error.response.status)
        console.log(error)
    }
})

router.get('/lyric', async (req, res) => {
    
    if (!req.query.q) return res.status(400).send('You need to send query for search')
    try {
        const response = await axios.get(`https://freapi.tk/api/lyric/genius?q=${encodeurl(req.query.q)}`)
        const text = format(response.data)
        res.send(text)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
    
    
    function format(text) {
        var words = splitLines(text)
    
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].trim()
        }
        words = order(words)
        
        return words.join('')
    
        function splitLines(t) { return t.split(/\r\n|\r|\n/); }
    
        function order(t) {
            var elements = [];
            for (let i = 0; i < t.length; i++) {
                if (t[i] != '' && t[i] != undefined && t[i] != null) {
                    elements.push(t[i] + '<br>')
                } else {
                    if (i != t.length - 1 && i != 0) {
                        if (t[i - 1] != '' && t[i + 1] != '') {
                            elements.push('<br>')
                        }
                    }
                }  
            }
            return elements
        }
    }
})

module.exports = router