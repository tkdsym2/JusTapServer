'use strict'

const Device = require('../lib/Device.js')

class JusTap extends Device {
    constructor(socket, commonConfig) {
        super(socket, commonConfig)
        this.hard = require('./JusTap_hard.js')
        this.status = {
            washing: false,
            time: 0
        }
        this.init()
    }

    init() {
        this.washing()
        this.openByTime()
    }

    washing() {
        const self = this
        // start supplying water
        self.on('washing/trigger', flag => {
            console.log('receiving flag ', flag)
            self.status.washing = flag
            self.push('washing/trigger', flag)
            self.hard.washing.trigger(flag)
        })
    }

    openByTime() {
        const self = this
        // start supplying water by time
        self.on('openByTime/time', span => {
            console.log('receiving span is ', span)
            self.status.time = Number(span)
            self.push('openByTime/time', span)
            self.hard.openByTime.time(Number(span))
            setTimeout(() => {
                self.status.time = 0
                self.push('openByTime/time', 0)
            }, Number(span))
        })
    }
}

module.exports = JusTap
