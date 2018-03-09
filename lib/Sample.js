const Device = require('../config/Device.js')

class Sample extends Device {
    constructor(socket, commonConfig) {
        super(socket, commonConfig)
        this.hard = require('./Sample_hard.js')
        this.status = {
            power: 0,
            auto: {
                volume: 0,
                time: 0
            }
        }
        this.init()
    }

    init() {
        let self = this

        let power = (data) => {
            self.hard.power(data)

            // update status and push server
            self.status.power = data
            self.push('power', data)
        }

        let volume = (data) => {
            self.hard.volume(data)

            // update status and push server
            self.status.auto.volume = data
            self.push('auto/volume', data)
        }

        let time = (data) => {
            self.hard.time(data)

            // update status and push server
            self.status.auto.time = data
            self.push('auto/time', data)
        }


        self.on('power', power)

        self.on('auto/volume', volume)

        self.on('auto/time', time)

        self.on('auto', (data) => {
            if (data && data.volume) {
                volume(data.volume)
            } else if (data && data.time) {
                time(data.time)
            }
        })
    }
}

module.exports = Sample
