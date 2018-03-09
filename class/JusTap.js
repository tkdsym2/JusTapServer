const Device = require('../lib/Device.js')

class JusTap extends Device {
    constructor(socket, commonConfig, config) {
        super(socket, commonConfig)
        this.hard = require('./JusTap_hard.js')
        this.status = {
            trigger: false,
            time: null
        }
        this.init()
    }

    init() {
        const self = this
        self.on('justap/trigger', data => {
            console.log('received', data)
            if (data) {
                console.log('data is true', data)
                self.hard.trigger.release(data)
            } else {
                console.log('data is false')
                self.hard.trigger.close(data)
            }
            self.status.time = data
            self.push('justap/trigger', data)
        })
    }
}

module.exports = JusTap
