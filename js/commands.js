import fs from 'fs'
import path from 'path'

const req = require.context('./widgets', true, /^\.\/.*\.js$/)
const commands = []

// load all widget commands
fs.readdirSync(path.resolve(__dirname, './widgets'))
  .forEach(widgetName => {
    if (/.js/.test(widgetName)) return // only read directories
    fs.readdirSync(path.resolve(__dirname, './widgets', widgetName))
      .forEach(file => {
        if (file !== 'commands.js') return
        const widgetCommands = req('./' + widgetName + '/' + file).default
        widgetCommands.forEach(cmd => {
          commands.push({ widgetName, pattern: new RegExp(`${cmd}`)})
        })
      })
  })

export default commands
