const spec = require('../spec')

export default {
    async showSwaggerSpec(ctx) {
        console.log('spec ....')
        ctx.body = spec
    }
}
