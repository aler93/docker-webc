const express = require('express')
const app     = express()
const port    = 4200

const { spawn } = require('child_process')
const docker = require("./docker")

app.get('/', (req, res) => {
    res.send('Node Engine rodando!')
})

app.get('/docker-ps', (req, res) => {
    // ID, ContainerName, Image, Command, Created, Status, Ports
    let comm = spawn('docker', ["ps", "-a", "--format", "'{{.ID}}'\t'{{.Names}}'\t'{{.Image}}'\t'{{.Command}}'\t'{{.RunningFor}}'\t'{{.Status}}'\t'{{.Ports}}'"])
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
