import discord from 'discord.js'
import isBot from '../utils/IsBot'
import msgToContext from '../utils/MsgToContext'
import Context from './Context'
import MiddlewareManager from './MiddlewareManager'
import prefixCheck from '../utils/PrefixCheck'
import { middleware } from '../types'

type Config = Readonly<{
    [key: string]: string | number
}>

function prefixSet(context: Context) {
    const newCtx = { ...context }

    newCtx.ex.content = newCtx.msg.content.slice(
        newCtx.ex.bot.config.prefix.length,
    )

    newCtx.header.debug.count += 1

    return newCtx
}

class Bot extends discord.Client {
    public middlewareManager: MiddlewareManager

    public config: Config

    public owner: discord.User | discord.Team | null

    constructor(options?: discord.ClientOptions, config?: Config) {
        super(options)

        this.owner = null
        this.middlewareManager = new MiddlewareManager()
        this.config = config || {}
    }

    login(token: discord.Snowflake): Promise<string> {
        this.on('ready', async () => {
            console.log('[ready]')

            this.owner = (await this.fetchApplication()).owner

            this.emit('readyState', this)
        })
            .on(
                'message',
                async (msg: discord.Message): Promise<any> => {
                    const context = msgToContext(msg)

                    context.ex.bot = this

                    const preprocessTask = [
                        {
                            cond: (_: Context): boolean => !isBot(_),
                            act: (_: Context) => _,
                        },
                        {
                            cond: (ctx: Context): boolean =>
                                ctx.msg.content.startsWith(
                                    ctx.ex.bot.config.prefix,
                                ),
                            act: (ctx: Context) => {
                                ctx.ex.content = ctx.msg.content.slice(
                                    ctx.ex.bot.config.prefix.length,
                                )
                                return ctx
                            },
                        },
                        {
                            cond: (_: any) => true,
                            act: (ctx: Context) => {
                                ctx.ex.args = ctx.ex.content
                                    .trimLeft()
                                    .split(/\s+/)
                                ctx.ex.command = ctx.ex.args?.[0]
                                return ctx
                            },
                        },
                    ]

                    let ctxCache = context
                    for (const { cond, act } of preprocessTask) {
                        if (cond(ctxCache)) {
                            ctxCache = await act(ctxCache)
                        } else return
                    }

                    // context.header.depth = 0

                    // eslint-disable-next-line no-restricted-syntax
                    for (const {
                        cond,
                        act,
                    } of this.middlewareManager.array()) {
                        if (await cond(context)) {
                            const resCtx = await act(context)
                            this.emit('final', resCtx)
                            return
                        }
                    }

                    this.emit('final', context)
                },
            )
            .on('final', async (context: Context) => {
                console.log(context.header)
            })

        return super.login(token)
    }

    public setConfig(config: Config) {
        this.config = config
    }
}

export default Bot
