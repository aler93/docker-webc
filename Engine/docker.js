const { spawn } = require('child_process')

module.exports = {
    containers: () => {
        let comm = spawn('docker', ["ps", "-a"])

        return comm.stdout.on('data',  (data) => {
            let out = data.toString()
            //console.log(out)

            return out
        })
    },
}
