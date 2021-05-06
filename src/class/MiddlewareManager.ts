import { middleware } from '../types'

class MiddlewareManager {
    private middlewareChain: Array<middleware>

    constructor(initMiddlewareChain?: Array<middleware>) {
        this.middlewareChain = initMiddlewareChain || []
    }

    public addMiddleware(mid: middleware) {
        this.middlewareChain.push(mid)

        return this
    }

    public array() {
        return [...this.middlewareChain]
    }
}

export default MiddlewareManager
