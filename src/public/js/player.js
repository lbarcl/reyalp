var obj

function play(id, options) {
    if (options) {
        obj = new player(id, options)

        obj.start()
    } else {
        obj = new player(id)
        obj.props.audio.addEventListener('ended', () => obj.skip())
        obj.props.audio.addEventListener('error', () => obj.skip())
        obj.start()
    }
}

function skip() { obj.skip() }
function constp() { obj.constp() }
function shuffle() {
    var state = !getvalue('shuffle')
    localStorage.setItem('shuffle', state)
    if (obj) obj.props.shuffle = state
}

function getvalue(id) {
    if (localStorage.getItem(id) == 'false') return false
    else if (localStorage.getItem(id) == 'true') return true
}

class player {
    constructor(id, options) {
        this.id = id
        this.props = {
            'shuffle': getvalue('shuffle') || false,
            'state': true,
            'audio': document.getElementById('player'),
            'footer': {
                'title': document.getElementById('footer-title'),
                'img': document.getElementById('footer-album'),
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
    }

    async start() {
        try {
            const { data } = await axios.get(`/api/apifree/spotify?id=${this.tracks[0].id}`)
            this.props.audio.src = `/api/youtube/play?url=${data.youtube.url}`
            this.props.audio.play()
            this.changeCurrent(this.tracks[0])
        } catch (error) {
            this.skip()
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
            return false
        }
        else if (!this.props.state) {
            this.props.state = true
            this.props.audio.play()
            return true
        }
    }

    changeCurrent(track) {
        this.props.footer.title.innerText = track.name
        this.props.footer.img.src = track.image
    }

    random() {
        let rindex = Math.floor(Math.random() * this.tracks.length)
        let temp = this.tracks[rindex]
        this.tracks[rindex] = this.tracks[0]
        this.tracks[0] = temp
    }
}