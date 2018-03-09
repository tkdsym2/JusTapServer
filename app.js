const config = require('./config/config.json')
const io = require('socket.io-client')
const socket = io.connect(config.server_url)

const JusTap = require('./class/JusTap')
const water = new JusTap(socket, config.justap, {})
