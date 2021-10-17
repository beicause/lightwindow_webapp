
const chalk = require('chalk')
const childProcess = require('child_process')

console.log(chalk.blue('build main...'))
childProcess.exec('cd lightwindow_main & yarn build', (err, stdout, stderr) => {
    console.error(err)
    console.log(stdout)
    console.error(stderr)
    console.log(chalk.green('main build successfully!\n'))
})
console.log(chalk.blue('build calendar...'))
childProcess.exec('cd lightwindow_calendar & yarn build', (err, stdout, stderr) => {
    console.error(err)
    console.log(stdout)
    console.error(stderr)
    console.log(chalk.green('calendar build successfully!\n'))
})
