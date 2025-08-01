import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import boxen from 'boxen'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

console.log('\n✰ Iniciando Sxnt ✰')

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { name, description, collaborators, author, version } = require(join(__dirname, './package.json'))

const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)
const subtitleStyle = chalk.white.bold
const responseStyle = chalk.dim.bold

let activeCollaborators = ''
for (const key in collaborators) {
  if (collaborators.hasOwnProperty(key)) {
    activeCollaborators += collaborators[key] + ', '
  }
}
activeCollaborators = activeCollaborators.slice(0, -2)

say('Sxnt\nBot', {
  align: 'center',
  gradient: ['red', 'blue']
})

say(description, {
  font: 'console',
  align: 'center',
  gradient: ['blue', 'magenta']
})

const message = `${subtitleStyle('Desarrollado por »')} ${responseStyle(author.name)}
${subtitleStyle('Código basado por »')} ${responseStyle('@Sxnt')}
${subtitleStyle('Colaboradores activos »')} ${responseStyle(activeCollaborators)}
${subtitleStyle('Versión »')} ${responseStyle(version)}`

console.log(boxen(message, {
  padding: 1,
  margin: 1,
  borderStyle: 'double',
  borderColor: 'blue'
}))

let isRunning = false

function start(file) {
  if (isRunning) return
  isRunning = true

  const args = [join(__dirname, file), ...process.argv.slice(2)]

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })

  const p = fork()

  p.on('message', data => {
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })

  p.on('exit', (_, code) => {
    isRunning = false
    console.error('🚩 Error:\n', code)
    process.exit()
    if (code === 0) return
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start(file)
    })
  })

  const opts = new Object(
    yargs(hideBin(process.argv)).exitProcess(false).parse()
  )

  if (!opts['test']) {
    if (!rl.listenerCount()) {
      rl.on('line', line => {
        p.emit('message', line.trim())
      })
    }
  }
}

process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    console.warn('🚩 Se excedió el límite de Listeners en:')
    console.warn(warning.stack)
  }
})

start('sisked.js')
  const message = `${subtitleStyle('Desarrollado por »')} ${responseStyle(author.name)}
${subtitleStyle('Código basado por »')} ${responseStyle('@Sxnt')}
${subtitleStyle('Colaboradores activos »')} ${responseStyle(activeCollaborators)}
${subtitleStyle('Versión »')} ${responseStyle(version)}`
console.log(boxen(message, { padding: 1, margin: 1, borderStyle: 'double', borderColor: 'blue', float: 'center', }))
var isRunning = false
function start(file) {
if (isRunning) return
isRunning = true
let args = [join(__dirname, file), ...process.argv.slice(2)]
setupMaster({
exec: args[0],
args: args.slice(1),
})
let p = fork()
p.on('message', data => {
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break
}
})
p.on('exit', (_, code) => {
isRunning = false
console.error('🚩 Error:\n', code)
process.exit()
if (code === 0) return
watchFile(args[0], () => {
unwatchFile(args[0])
start(file)
})
})
let opts = new Object(yargs(hideBin(process.argv)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})
}
process.on('warning', (warning) => {
if (warning.name === 'MaxListenersExceededWarning') {
console.warn('🚩 Se excedió el límite de Listeners en:')
console.warn(warning.stack)
}
})
start('sisked.js')
