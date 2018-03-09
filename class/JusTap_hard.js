const fs = require('fs')

const dir = '/sys/class/gpio'
const gpio26 = dir + '/gpio26'

const openBulb = span => {
    // onになる
    fs.writeFileSync(dir + '/export', 26)
    fs.writeFileSync(gpio26 + '/direction', 'out')
    fs.writeFileSync(gpio26 + '/value', 1)

    return new Promise((resolve, reject) => {
        setTimeout(resolve, span)
    })
}

exports.trigger = {
    release: span => {
        console.log('released', span)
        openBulb(parseInt(span))
            .then(() => {
                // span 秒後にbulbを閉める
                fs.writeFileSync(gpio26 + '/value', 0)
                fs.writeFileSync(dir + '/unexport', 26)
                console.log('finished')
            })
            .catch(error => {
                console.log('error is occuered', error)
            })
    },
    close: span => {
        console.log('closed', span)
    }
}
