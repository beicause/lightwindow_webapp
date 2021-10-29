const chalk = require('chalk')
const childProcess = require('child_process')
const {
  main,
  calendar
} = require('./util')

console.log(chalk.blue('build main...'))
childProcess.exec('pnpm run build', { cwd: main }, (err, stdout, stderr) => {
  err && console.error(err)
  console.log(stdout)
  stderr && console.error(stderr)
  console.log(chalk.green('main built completely!\n'))
})
console.log(chalk.blue('build calendar...'))
childProcess.exec('pnpm run build', { cwd: calendar }, (err, stdout, stderr) => {
  err && console.error(err)
  console.log(stdout)
  stderr && console.error(stderr)
  console.log(chalk.green('calendar built completely!\n'))
})
