import fs from 'fs'
import path from 'path'

const req = require.context('./widgets', true, /^\.\/.*\.js$/)
const commands = []

// load all widget commands
fs.readdirSync(path.resolve(__dirname, './widgets'))
  .forEach(widget => {
    if (/.js/.test(widget)) return // only read directories
    fs.readdirSync(path.resolve(__dirname, './widgets', widget))
      .forEach(file => {
        if (file !== 'commands.js') return
        const widgetCommands = req('./' + widget + '/' + file).default
        widgetCommands.forEach(cmd => {
          commands[cmd] = widget.toUpperCase()
        })
      })
  })

export default commands
