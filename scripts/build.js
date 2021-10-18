const chalk = require('chalk')
const childProcess = require('child_process')
const {
  main,
  calendar
} = require('./util')

console.log(chalk.blue('build main...'))
childProcess.exec('yarn build', { cwd: main }, (err, stdout, stderr) => {
  console.error(err)
  console.log(stdout)
  console.error(stderr)
  console.log(chalk.green('main build completely!\n'))
})
console.log(chalk.blue('build calendar...'))
childProcess.exec('yarn build', { cwd: calendar }, (err, stdout, stderr) => {
  console.error(err)
  console.log(stdout)
  console.error(stderr)
  console.log(chalk.green('calendar build completely!\n'))
})
