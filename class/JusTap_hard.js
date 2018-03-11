'use strict'

const fs = require('fs')

const dir = '/sys/class/gpio'
const gpio26 = dir + '/gpio26'

// for SSR
const startSupplyingWater = () => {
    console.log('open bulb')
    fs.writeFileSync(dir + '/export', 26)
    fs.writeFileSync(gpio26 + '/direction', 'out')
    fs.writeFileSync(gpio26 + '/value', 1)
}

// for SSR
const stopSupplyingWater = () => {
    console.log('close bulb')
    fs.writeFileSync(gpio26 + '/value', 0)
    fs.writeFileSync(dir + '/unexport', 26)
}

const openBulbByTime = span => {
    startSupplyingWater()
    return new Promise((resolve, reject) => {
        console.log('openbulb time generate. spasn is ', span)
        setTimeout(resolve, span)
    })
}

exports.openByTime = {
    time: span => {
        console.log('supply water by time')
        openBulbByTime(span)
            .then(() => {
                console.log('stop supplying water by time')
                stopSupplyingWater()
            })
            .catch(error => {
                console.log('error is occuerd', error)
            })
    }
}

exports.washing = {
    trigger: flag => {
        if (flag) {
            console.log('supplying water !')
        } else {
            console.log('stop water')
        }
    },
    release: () => {
        console.log('supplying water !')
        startSupplyingWater()
    },
    close: () => {
        console.log('stop water')
        stopSupplyingWater()
    }
}
