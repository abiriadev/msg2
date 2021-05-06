import discord from 'discord.js'
import { n } from '../types'

class Context {
    public ex: {
        [key: string]: any
    }

    public header: {
        debug: {
            [key: string]: any
        }
        depth: number
        hitCommand: n<string>
    }

    constructor(public msg: discord.Message) {
        this.header = {
            debug: {
                count: 0,
            },
            depth: 0,
            hitCommand: null,
        }
        this.ex = {}
    }
}

export default Context
