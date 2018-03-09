const EventEmitter = require('eventemitter3')

class Device {

    // 変数名 スネークケース
    // メンバ変数名 スネークケース
    // メソッド名　キャメルケース

    // ハードに対する命令
    // Hard.xx.method()

    constructor(socket, config) {
        this.socket = socket
        this.eventListener = new EventEmitter()

        this.device_id = config.device_id
        this.device_type = config.device_type
        // デバイス共通のstatusって何があるだろう？
        this.common_status = {}
        // デバイスが個別にもつstatus
        this.status = {}

        this.connectProcess()
        this.listen()
    }

    connectProcess() {
        let self = this
        this.socket.on('connect', () => {
            console.log('connect!')
            self.register()
        })
        this.socket.on('disconnect', () => {
            console.log('disconnect')
        })
    }


    listen() {
        const self = this

        // server側から  データくれ
        this.socket.on(self.device_id + '/get', (body) => {
            if (!Array.isArray(body)) {
                body = [body]
            }
            // 配列で処理
            let res = []
            body.forEach((obj) => {
                // 継承先のクラスへ
                let data = getStatus(obj.status_name)
                // statusをserver側に返す
                res.push({
                    status_name: obj.status_name,
                    data: data
                })
            })
            // 配列で返す
            self.socket.emit(self.device_id + '/return', res)
        })

        // @TODO ハードウェアへの命令が失敗したときのエラー返し
        // server側から  こういう状態に変更（稼働）してくれ
        this.socket.on(self.device_id + '/set', (body) => {
            if (!Array.isArray(body)) {
                body = [body]
            }
            body.forEach((obj) => {
                // 継承先のクラスへ
                self.eventListener.emit('set/' + obj.status_name, obj.data)
            })
        })
    }

    // statusが変わったら逐次pushする
    // サーバ側ではpush()されない限りstatus変更はしない
    // 命令を送っても実際にハードウェアが動くとは限らず， 様々なエラーがあり得るため
    push(status_name, data) {
        const self = this
        // @TODO 処理が重くなってきたら
        // 短時間のバッファ時間を設け， その間に実行されたものは配列にまとめて送る
        this.socket.emit(self.device_id + '/return', {
            status_name: status_name,
            data: data
        })
    }


    // callback(data)
    // statusがちゃんと変わったら push()でstatusをサーバに返す
    on(status_name, callback) {
        let self = this
        self.eventListener.on('set/' + status_name, (data) => {
            callback(data)
        })
    }

    register() {
        this.socket.emit('common/register', {
            device_id: this.device_id,
            device_type: this.device_type
        })

        this.socket.on('common/register', (res) => {
            console.log(res)
        })
    }

    // status_name = 'mix/speed' だったら
    // status.mix.speedを返す処理を書く（何階層でもいけるように）
    getStatus(status_name) {
        let dir = status_name.split('/')
        let temp = this.status
        dir.forEach((d) => {
            if (temp && temp[d] != null && temp[d] != undefined) {
                temp = temp[d]
            } else {
                temp = null
            }
        })
        return temp
    }

    setStatus(status_name, data) {
        let dir = status_name.split('/')
        let temp = this.status
        dir.forEach((d, i) => {
            if (i == dir.length - 1) {
                temp[d] = data
                return
            }
            if (typeof temp[d] == 'object') {
                temp = temp[d]
            } else {
                temp[d] = {}
                temp = temp[d]
            }
        })
    }
}
module.exports = Device
