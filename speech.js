const os = require('os')
const fs = require('fs')
const path = require('path')
let config

try {
	config = require("./config.js")
} catch (e) {
	config = false
}

if (!config || !config.speech || !config.speech.keyFilename || !config.speech.hotwords || !config.speech.language) {
	throw "Configuration error."
}

var keyFile = JSON.parse(fs.readFileSync(path.resolve(config.speech.keyFilename), "utf8"))

// Configure Sonus
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')({
	projectId: keyFile.project_id,
	keyFilename: config.speech.keyFilename,
})

// Hotword helpers
let sensitivity = config.speech.sensitivity || '0.5'
let hotwords = []
let addHotword = (modelFile, hotword, sensitivity) => {
	let file = path.resolve(modelFile)
	if (fs.existsSync(file)) {
		hotwords.push({ file, hotword, sensitivity })
	} else {
		console.log('Model: "', file, '" not found.')
	}
}

for (let i = 0; i < config.speech.hotwords.length; i++) {
	addHotword(config.speech.hotwords[i].model, config.speech.hotwords[i].keyword, sensitivity)
}


const language = config.speech.language
const recordProgram = (os.arch() == 'arm') ? "arecord" : "rec"
const device = (config.speech.device != "") ? config.speech.device : 'default'
const sonus = Sonus.init({ hotwords, language, recordProgram, device }, speech)

// Start Recognition
Sonus.start(sonus)

// Event IPC
sonus.on('hotword', (index, keyword) => console.log("!h:", index, keyword))
sonus.on('partial-result', result => console.log("!p:", result))
sonus.on('final-result', result => console.log("!f:", result))
sonus.on('error', error => console.error("!e:", error))
