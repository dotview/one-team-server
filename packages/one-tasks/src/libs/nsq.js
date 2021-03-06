const NsqMessenger = require('./common')
const moment = require('moment')
const nsq = require('nsqjs')

const requestTopic = 'request_topic'
const responseTopic = 'response_topic'

class NsqSender extends NsqMessenger {
    constructor(listenTopic) {
        super(listenTopic)
        const nsqAddres = process.env.NSQ_ADDRESS || '127.0.0.1'
        const lookupAddress = process.env.LOOKUP_ADDRESS || '127.0.0.1:4161'
        this.writer = new nsq.Writer(nsqAddres, 4150)
        this.reader = new nsq.Reader(this.listenTopic, 'test_channel', {
            lookupdHTTPAddresses: lookupAddress,
            lookupdPollInterval: 5,
            heartbeatInterval: 5
        })
        this.messageNumber = 1
        this.inverval = null
        this.handleWriterInit()
    }

    handleMessage() {
        this.reader.on('message', msg => {
            msg.finish()
            console.log(`${moment().format('YYYY-MM-DD hh:mm:ss.SSS')} Received response on message nr ${msg.body.toString()}`)
        })
    }

    sendMessage() {
        if (this.writer.ready) {
            console.log(`${moment().format('YYYY-MM-DD hh:mm:ss.SSS')} Send message nr ${this.messageNumber}`)
            this.writer.publish(requestTopic, `${this.messageNumber}`)
            this.messageNumber++
        } else {
            clearInterval(this.inverval)
            this.inverval = null
        }
    }

    sendMessages() {
        console.log(`${moment().format('YYYY-MM-DD hh:mm:ss.SSS')} Writer is ready. Will send messages.`)
        this.inverval = setInterval(() => {
            this.sendMessage()
        }, process.env.SEND_MESSAGE_TIMEOUT || 5000)
    }

    handleWriterInit() {
        this.emitter.on('writerInit', () => {
            this.sendMessages()
        })
    }
}

const nsqSender = new NsqSender(responseTopic)
nsqSender.init().then(() => {
    nsqSender.handleMessage()
})
