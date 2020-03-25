import logger from '../src/logger'

describe('test logger', () => {

    test('testing logger', async () => {
        expect(logger.info('test info logger')).not.toBeNull()
        expect(logger.error({testObj:'test error logger'})).not.toBeNull()
    })
    test('testing logger rotate', async () => {
        for(var i=0; i< 200; i++) {
            logger.error('test error logger')
        }
        expect(logger.error('test error logger')).not.toBeNull()
    })
})

