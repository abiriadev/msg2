import discord from 'discord.js'
import ContextHeader from './ContextHeader'
import Bot from './Bot'

class Context {
    static copy(originalCtx: Context): Context {
        const newCtx = new Context(originalCtx.msg)

        // Object.assign(newCtx, {
        //     ex: ctx.ex,
        // })

        newCtx.ex = { ...originalCtx.ex }

        const copyedHeader = new ContextHeader({
            depth: originalCtx.header.getDepth(),
        })

        if (originalCtx.header.getIsFinished()) copyedHeader.setFinish()
        if (originalCtx.header.getIsHit()) copyedHeader.setHit()
        copyedHeader.currentCommand = originalCtx.header.currentCommand
        if (originalCtx.header.getHitCommand() !== null)
            copyedHeader.setHitCommand(
                <string>originalCtx.header.getHitCommand(),
            )

        newCtx.header = copyedHeader

        return newCtx
    }

    header: ContextHeader = new ContextHeader()

    ex: {
        [key: string]: any
    } = {}

    finish() {
        this.header.setFinish()
        this.ex.bot.emit('finish', this)
        return this
    }

    constructor(public msg: discord.Message) {
        // this.bot =
    }
}

export default Context
