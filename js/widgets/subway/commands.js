import { allTrains } from './utils'

const commands = [
  // 'show me the subway',
  // 'show me the train',
  `show me the ([${allTrains.join('|')}])`,
  `show me the ([${allTrains.join('|')}]) train`,
]

export default commands
