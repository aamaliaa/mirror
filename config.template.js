module.exports = {
  host: 'http://localhost:3005',
  api: {
    mtaKey: 'YOUR_MTA_API_KEY',
    forecastKey: 'YOUR_FORECAST_API_KEY',
    googleCalTokenPath: __dirname + '/google-calendar.json',
    googleCalSecretPath: __dirname + '/client_secret.json'
  },
  subway: {
    delay: 30000, // poll API every 30 secs
    stops: [
      {
        timeToWalk: 5, // 5 min, the time it takes to walk to your subway stop
        stationId: 127, // subway station id
        direction: 'S' // "S" southbound or "N" northbound
      },
    ],
  },
  status: {
    delay: 300000, // poll API every 5 min
    regexFilters: [
      /[23]/
    ],
    trains: [ '2' ],
    dayRange: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeRange: [6, 10],
  },
  weather: {
    delay: 300000, // 5 min
    latitude: 40.75529,
    longitude: -73.987495
  },
  calendar: {
    delay: 1800000 // 30 min
  },
  chores: {
    monday: [{
      text: 'Take out trash tonight',
      icon: 'trash',
      timeRange: [18, 23]
    }],
    tuesday: [],
    wednesday: [{
        text: 'Take out recycling tonight',
        icon: 'recycle',
        timeRange: [18, 23]
      },
      {
        text: 'Take out trash tonight',
        icon: 'trash',
        timeRange: [18, 23]
      }
    ],
    thursday: [],
    friday: [{
      text: 'Take out trash tonight',
      icon: 'trash',
      timeRange: [18, 23]
    }],
    saturday: [],
    sunday: [{
      text: 'Water plant babies today',
      icon: 'leaf'
    }]
  }
};
