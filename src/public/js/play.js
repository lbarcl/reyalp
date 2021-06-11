var list = []

const audio = document.getElementsByTagName('audio')[0]
const footer = document.getElementById('footer')

function play(type, id) {
    switch (type) {
        case 'pl':
            clear()
            playpl(id)
            changeCurrent(list[0])
            break
    }
}

function clear() {
    list = []
}

function playpl(id) {
    const pl = JSON.parse(sessionStorage.getItem(id))
    const tracks = pl.tracks

    var currentIndex = tracks.length

    while (0 !== currentIndex) {
        var randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        var temp = tracks[currentIndex]
        tracks[currentIndex] = tracks[randomIndex]
        tracks[randomIndex] = temp
    }

    list = tracks
}

async function changeCurrent(track) {
    const response = await axios.get(`/api/apifree/spotify?id=${track.id}`)
    audio.src = `/api/youtube/play?url=${response.data.youtube.url}`
    audio.play()
    footer.innerHTML = `<img src="${track.image}" id="album"><h3>${track.name}</h3>`
}

audio.addEventListener("ended", () => {
    list.shift()
    changeCurrent(list[0])
})

audio.addEventListener("error", () => {
    list.shift()
    changeCurrent(list[0])
})