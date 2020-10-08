const exec = require('child_process').exec

const asyncExec = async (cmd) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            throw error
        }

        console.log(stderr)
        console.log(stdout)

        return true
    })
}

(async () => {
    await asyncExec('npm install ./chat-client')
    await asyncExec('npm install ./chat-server')
})()