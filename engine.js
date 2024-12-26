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

app.get('/docker-ps', (req, res) => {
    // 0 ID, 1 ContainerName, 2 Image, 3 Command, 4 Created, 5 Status, 6 Ports
    let comm = spawn('docker', ["ps", "-a", "--format", "'{{.ID}}'\t'{{.Names}}'\t'{{.Image}}'\t'{{.Command}}'\t'{{.RunningFor}}'\t'{{.Status}}'\t'{{.Ports}}'\t"])
    var lines = []

    comm.stdout.on('data',  (data) => {
        let out = data.toString()
        let col = []
        let txt = ""
        for( let i = 0; i < out.length; i++ ) {
            if( out[i] === "\t" ) {
                //console.log(txt.replaceAll("'", ""))
                col.push(txt.replaceAll("'", ""))
                txt = ""
                continue
            }
            if( out[i] === "\n" ) {
                lines.push(col)
                txt = ""
                col = []
                continue
            }
            txt += out[i]
        }
    })
    comm.stdout.on("close", () => {
        //console.log(lines)
        res.send(JSON.stringify(lines))
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
