import { allTrains } from './utils'

const commands = [
  'show me the subway',
  'show me the train',
]

allTrains.forEach(t => {
  commands.push(`show me the ${t}`)
  commands.push(`show me the ${t} train`)
})

export default commands
