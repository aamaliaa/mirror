import fetch from 'node-fetch'
import moment from 'moment'
import { networkInterfaces } from 'os'

const optionalParam = /\s*\((.*?)\)\s*/g
const optionalRegex = /(\(\?:[^)]+\))\?/g
const namedParam    = /(\(\?)?:\w+/g
const splatParam    = /\*\w+/g
const escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#]/g

const utils = {
  commandToRegExp: (command) => {
    command = command.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, (match, optional) => (optional ? match : '([^\\s]+)'))
                .replace(splatParam, '(.*?)')
                .replace(optionalRegex, '\\s*$1?\\s*')
    return new RegExp('^' + command + '$', 'i')
  },

  getLocalIP: () => {
    return [].concat.apply([], Object.values(networkInterfaces()))
      .filter(details => details.family === 'IPv4' && !details.internal)
      .pop().address
  },

  formatTime: (timestamp) => {
    let numMin = null
    const time = moment(timestamp, 'X').fromNow()
    const found = time.match(/^in ([0-9]+) minutes/)
    if (found && found[1]) {
      numMin = found[1]
    }

    return {
      str: time.replace('in ', '').replace('a minute', '1 minute'),
      numMin: numMin
    }
  }
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

const get = url => fetch(url).then(checkStatus)

export default utils
