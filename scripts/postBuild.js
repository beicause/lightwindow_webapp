const fs = require('fs')
const path = require('path')
const {deleteDir, copyDir} = require('./util')
const chalk = require("chalk");

const root=path.resolve('./')
const calendarBuild=path.resolve(root,'lightwindow_calendar','dist','build','h5')
const mainBuild=path.resolve(root,'lightwindow_main','dist')
const outDir=path.resolve(root,'dist')

if (!fs.existsSync(calendarBuild)||fs.readdirSync(calendarBuild).length===0) throw Error('calendar dist/build/h5目录不存在或为空，请先打包')
if (!fs.existsSync(mainBuild)||fs.readdirSync(mainBuild).length===0) throw Error('main dist目录不存在或为空，请先打包')
if (fs.existsSync(outDir)) deleteDir(outDir)

copyDir(mainBuild,outDir)
copyDir(calendarBuild,path.resolve(outDir,'calendar'))
console.log(chalk.green('output successfully!'))
