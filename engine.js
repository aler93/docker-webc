const express = require('express')
const app     = express()
const port    = 4201

const { spawn } = require('child_process')
const docker = require("./Engine/docker")
/*
let ui = spawn("npm", ["run", "serve", "--", "--port", "4200"])
ui.stdout.on('data',  (data) => {
    console.log(data.toString())
})
*/

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
})

app.get('/', (req, res) => {
    res.send('Node Engine rodando!')
})

app.get('/ps', (req, res) => {
    let comm  = spawn('docker', ["ps", "-a", "--format", "json"])
    var lines = []
    var out   = []

    comm.stdout.on('data',  (data) => {
        out     = data.toString()
        let txt = ""
        for( let i = 0; i < out.length; i++ ) {
            if( out[i] === "\n" ) {
                lines.push(JSON.parse(txt))
                txt = ""
                continue
            }
            txt += out[i]
        }
    })
    comm.stdout.on("close", () => {
        //console.log(lines)
        res.send({result: lines})
    })
})

app.get('/images', (req, res) => {
    let comm = spawn('docker', ["images", "-a", "--format", "json"])
    var lines = []

    comm.stdout.on('data',  (data) => {
        let out = data.toString()
        console.log(out)

        let txt = ""

        for( let i = 0; i < out.length; i++ ) {
            if( out[i] === "\n" ) {
                lines.push(JSON.parse(txt))
                txt = ""
                continue
            }
            txt += out[i]
        }
    })
    comm.stdout.on("close", () => {
        res.send({result: lines})
    })
})

app.get('/volume-ls', (req, res) => {
    let comm = spawn('docker', ["volume", "ls", "--format", "json"])
    var lines = []

    comm.stdout.on('data',  (data) => {
        let out = data.toString()
        console.log(out)

        let txt = ""

        for( let i = 0; i < out.length; i++ ) {
            if( out[i] === "\n" ) {
                lines.push(JSON.parse(txt))
                txt = ""
                continue
            }
            txt += out[i]
        }
    })
    comm.stdout.on("close", () => {
        res.send({result: lines})
    })
})

app.get('/network-ls', (req, res) => {
    let comm = spawn('docker', ["network", "ls", "--format", "json"])
    var lines = []

    comm.stdout.on('data',  (data) => {
        let out = data.toString()
        console.log(out)

        let txt = ""

        for( let i = 0; i < out.length; i++ ) {
            if( out[i] === "\n" ) {
                lines.push(JSON.parse(txt))
                txt = ""
                continue
            }
            txt += out[i]
        }
    })
    comm.stdout.on("close", () => {
        res.send({result: lines})
    })
})

app.get('/start', (req, res) => {
    if( req.query.id.length <= 0 ) {
        return
    }

    let comm = spawn('docker', ["start", req.query.id])
    var out  = ""

    comm.stdout.on('data',  (data) => {
        out = data.toString()
    })
    comm.stdout.on("close", (code) => {
        res.send(JSON.stringify({result: out, command: "docker stop " + req.query.id, code: code}))
    })
})

app.get('/stop', (req, res) => {
    if( req.query.id.length <= 0 ) {
        return
    }

    let comm = spawn('docker', ["stop", req.query.id])
    var out  = ""

    comm.stdout.on('data',  (data) => {
        out = data.toString()
    })
    comm.stdout.on("close", (code) => {
        res.send(JSON.stringify({result: out, command: "docker stop " + req.query.id, code: code}))
    })
})

app.listen(port, () => {
  console.log(`API funcionando na porta ${port}`)
})
