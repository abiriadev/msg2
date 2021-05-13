import Command from './Command'

class MiddlewareManager {
    private middlewareChain: Array<Command>

    constructor(initMiddlewareChain: Array<Command> = []) {
        this.middlewareChain = initMiddlewareChain
    }

    addCommand(mid: Command) {
        this.middlewareChain.push(mid)
        return this
    }

    array() {
        return [...this.middlewareChain]
    }
}

export default MiddlewareManager
