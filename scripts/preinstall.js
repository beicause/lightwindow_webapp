
const childProcess = require('child_process')
const { root, calendar } = require('./util')
const chalk = require('chalk')

if (process.cwd() !== root) return
console.log(chalk.blue('install calendar'));
childProcess.exec('yarn install', { cwd: calendar }, (err, stdout, stderr) => {
    err && console.error(err)
    console.log(stdout)
    stderr && console.error(stderr)
    console.log(chalk.green('calendar installed compeletely!'));
})