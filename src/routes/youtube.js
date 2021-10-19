const router = require('express').Router()
const ytdl = require('ytdl-core')

router.get('/play', async (req, res) => {
    const { url } = req.query
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    if (!ytdl.validateURL(url)) {
        return res.sendStatus(400)
    } else {
        const readableStreem = ytdl(url, {quality: 'highestaudio'})
        readableStreem.on('data', (chunk) => {
            res.write(chunk)
        })

        readableStreem.on('error', (err) => {
            res.sendStatus(err.statusCode);
            console.log(err)
        });

        readableStreem.on('end', () => {
            res.end();
        });
    }
})

module.exports = router