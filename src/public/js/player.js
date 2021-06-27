var obj

function play(id, options) {
    if (options) {
        obj = new player(id, options)
        obj.props.audio.addEventListener('ended', () => obj.skip())
        obj.props.audio.addEventListener('error', () => obj.skip())
        obj.start(true)
    } else {
        obj = new player(id)
        obj.props.audio.addEventListener('ended', () => obj.skip())
        obj.props.audio.addEventListener('error', () => obj.skip())
        obj.start(true)
    }
}

function skip() { obj.skip() }
function constp() { obj.constp() }
function shuffle() { obj.setshuffle() }

class player {
    constructor(id, options) {
        this.id = id
        this.props = {
            'shuffle': false,
            'state': true,
            'audio': document.getElementById('player'),
            'footer': {
                'title': document.getElementById('footer-title'),
                'img': document.getElementById('footer-album'),
                'controls': {
                    'shuffle': document.getElementById('shuffle'),
                    'plps': document.getElementById('plps')
                }
            }
            //'history': []
        }

        if (options) {
            this.options = options
            this.list = JSON.parse(window.sessionStorage.getItem(options.plid))
            this.tracks = this.list.tracks.slice(options.index - 1)
        } else {
            this.list = JSON.parse(window.sessionStorage.getItem(id))
            this.tracks = this.list.tracks
        }

        if (this.props.shuffle) this.random()
        this.props.footer.controls.shuffle.style.color = 'whitesmoke'
    }

    async start(f) {
        const { data } = await axios.get(`/api/apifree/spotify?id=${this.tracks[0].id}`).catch(error => {
            return this.skip()
        })

        this.props.audio.src = `/api/youtube/play?url=${data.youtube.url}`
        var promise = this.props.audio.play()
        this.props.footer.controls.plps.innerHTML = pausesvg
        if (promise !== undefined) {
            promise.then(_ => {
                this.changeCurrent()
            })
            .catch(error => {
                this.skip()
            })
        }
    }

    skip() {
        //this.settings.history.push(this.tracks[0])
        this.tracks.shift()
        if (this.props.shuffle) this.random()
        this.start()
    }

    constp() {
        if (this.props.state) {
            this.props.state = false
            this.props.audio.pause()
            this.props.footer.controls.plps.innerHTML = playsvg
            return false
        }
        else if (!this.props.state) {
            this.props.state = true
            this.props.audio.play()
            this.props.footer.controls.plps.innerHTML = pausesvg
            return true
        }
    }

    setshuffle() {
        this.props.shuffle = !this.props.shuffle
        if (this.props.shuffle) this.props.footer.controls.shuffle.style.color = `#1DB954`
        else this.props.footer.controls.shuffle.style.color = 'whitesmoke'
        return this.props.shuffle
    }

    changeCurrent() {
        this.props.footer.title.innerText = this.tracks[0].name
        this.props.footer.img.src = this.tracks[0].image
    }

    random() {
        let rindex = Math.floor(Math.random() * this.tracks.length)
        let temp = this.tracks[rindex]
        this.tracks[rindex] = this.tracks[0]
        this.tracks[0] = temp
    }
}

const playsvg = `<i class="bi bi-play"></i>`
const pausesvg = `<i class="bi bi-pause"></i>`