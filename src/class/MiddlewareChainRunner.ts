import chalk from 'chalk'
import Command from './Command'

type MiddlewareChain = Array<Command>

function logMid(middleware: Command) {
    if (middleware.name) {
        console.log(`current middleware: ${middleware.name}`)

        if (middleware.description)
            console.log(
                chalk.hex('#40691D')(
                    `***\ndescription: ${middleware.description}\n***`,
                ),
            )
    } else console.log(`[anonymous middleware]`)
}

export default class MiddlewareChainRunner {
    constructor(private middlewareChain: MiddlewareChain) {}

    public run() {
        for (let i = 0; i < this.middlewareChain.length; i += 1) {
            const middleware = this.middlewareChain[i]
            process.stdout.write(`${chalk.hex('#1AB7AF')(`[${i}]`)} `)
            logMid(middleware)
        }
        return true
    }
}
