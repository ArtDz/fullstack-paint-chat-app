const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const chalk = require('chalk')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

// Объект в котором хранятся все сессии. С помощью него делаем широковещательную рассылку
const aWss = WSServer.getWss()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.ws('/', (ws, req) => {
    console.log(chalk.bgMagenta('ПОДКЛЮЧЕНИЕ УСТАНОВЛЕНО'))
    ws.on('message', (msg) => {
        console.log(chalk.yellow(msg))
        msg = JSON.parse(msg)
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg)
                break
            case 'draw':
                connectionHandler(ws, msg)
                break
        }
    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64`,'')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'загружено'})
    } catch(error) {
        console.log(error)
        return res.status(500).json('server error')
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        if (file) {
            const data = `data:image/png;base64` + file.toString('base64')
            res.json(data)
        }
    } catch(error) {
        console.log(error)
        return res.status(500).json('server error')
    }
})

app.listen(PORT, () => console.log(chalk.blue(`server started on PORT ${PORT}`)))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}
