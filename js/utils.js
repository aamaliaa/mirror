import fetch from 'node-fetch'
import moment from 'moment'
import { host } from './config'

const utils = {
  getLocalIP: () => {
    return new Promise((resolve, reject) => {
      var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
      var pc = new RTCPeerConnection({iceServers:[]})
      var noop = () => {}

      pc.createDataChannel("")  //create a bogus data channel
      pc.createOffer(pc.setLocalDescription.bind(pc), noop) // create offer and set local description
      pc.onicecandidate = ice => {  // listen for candidate events
        if(!ice || !ice.candidate || !ice.candidate.candidate) return
        var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]
        resolve(myIP)
        pc.onicecandidate = noop
      }
    })
  },

  formatTime: (timestamp) => {
    var numMin = null
    var time = moment(timestamp, 'X').fromNow()
    var found = time.match(/^in ([0-9]+) minutes/)
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
