import fetch from 'node-fetch'
import { host, subway } from './config'

const utils = {

    getLastUpdated: () => {
      return get(`${host}/lastUpdated`)
    },

    getWeather: () => {
      return get(`${host}/weather`)
    },

    getSubwayTimes: () => {
      return get(`${host}/schedule/${subway.stationId}`)
    },

    getSubwayStatus: () => {
      return get(`${host}/status/subway`)
    },

    getCalendar: () => {
      return get(`${host}/calendar`)
    },

    getLocalIP: () => {
      return new Promise(function(resolve, reject) {
        var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new RTCPeerConnection({iceServers:[]});
        var noop = function(){};

        pc.createDataChannel("");  //create a bogus data channel
        pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
        pc.onicecandidate = function(ice) {  // listen for candidate events
          if(!ice || !ice.candidate || !ice.candidate.candidate) return;
          var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
          resolve(myIP);
          pc.onicecandidate = noop;
        };
      });
    }

};

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
