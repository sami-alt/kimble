const gameEl = document.getElementById('game')

class Player {
    constructor(color, pos) {
        this.color = color; 
        this.pos = pos;
        this.positions = [-1, -2, -3, -4]
    }

    async play() {
        const dice = Math.round(Math.random() * 5) + 1
        gameEl.innerHTML += `<div>Player ${this.color} throws ${dice}</div>`
        const outOfHomeBase = (dice === 6 || dice === 3)

        const pawnToMove = await getAnswer()

        if (outOfHomeBase && this.positions[pawnToMove] < 0) {
            this.positions[pawnToMove] = this.pos;
            await this.play()
        } else {
            if (this.positions[pawnToMove] >= 0) {
                this.positions[pawnToMove] += dice
            }
        }

        const newPosition = this.positions[pawnToMove]
        for (const player of players) {
            if (player !== this) {
                for (let i = 0; i < player.positions.length; i++) {
                    if (newPosition === player.positions[i]) {
                        player.positions[i] = -1
                    }
                }
            }
        }
    }

    render() {
        const board = document.getElementById('board')
        const index = tableIndexToTdIndex(this.pos)
        const td = board.querySelectorAll('td')[index]
        console.log({index, td})
        td?.classList.add(this.color + '-start')
        /*
       const tds = board.querySelectorAll('td')
       for (let i = 0; i < 28; i++) {
           const td = tds[tableIndexToTdIndex(i)]
           if (td) td.innerText = String(i)
       }
       */
    }
};

let players = [new Player('Red', 0),
               new Player('Blue', 7),
               new Player('Green', 14),
               new Player('Yellow', 21)];


let round = 1

const endGame = async () => {
    for (let i = 0; i < 1; i++) {
        for (const player of players) {
            player.render()
            //await player.play()
        }
    }
}

endGame()

async function getAnswer() {
    return new Promise((resolve) => {
        const el = document.getElementById('ans')
        el.oninput = (/** @type {KeyboardEvent} */ event) => {
            event.preventDefault()
            const val = parseInt(el.value)
            console.log(val)
            resolve(val)
            el.oninput = null
            el.value = null
        }
    })
}

function tableIndexToTdIndex(tableIndex) {
    if (tableIndex < 7) {
        return tableIndex
    }
    if (tableIndex <= 13) {
        return (tableIndex - 6) * 3 + 6 
    }
    if (tableIndex <= 19) {
        const lastBefore = tableIndexToTdIndex(13)
        const moveBack = 19 - tableIndex + 2
        return lastBefore + moveBack
    }
    if (tableIndex <= 27) {
        const lastBefore = tableIndexToTdIndex(19)
        const moveUpRows = 5 + (tableIndex - 26)
        const first = lastBefore - 4
        return first + moveUpRows * -3
    }

    throw new Error(`Invalid index ${tableIndex}`)
}