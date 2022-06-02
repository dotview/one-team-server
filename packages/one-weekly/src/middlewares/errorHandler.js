// import config from '../configs'

const { UNKNOWN_ENDPOINT, UNKNOWN_ERROR } = require('../constants/error')

/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
function errorHandler() {
    return async(ctx, next) => {
        try {
            await next()
            // 404
            if (!ctx.body && (!ctx.status || ctx.status === 404)) {
                ctx.res.notFound(
                    UNKNOWN_ENDPOINT.code,
                    UNKNOWN_ENDPOINT.message
                )
            }
        } catch (err) {
            ctx.res.internalServerError(
                UNKNOWN_ERROR.code,
                UNKNOWN_ERROR.message
            )

            // Recommended for centralized error reporting,
            // retaining the default behaviour in Koa
            ctx.app.emit('error', err, ctx)
        }
    }
}

module.exports = errorHandler
