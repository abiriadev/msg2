import discord from 'discord.js'
import chalk from 'chalk'
import * as MSG from '../index'
// import Command from "..";

const bot = new MSG.Bot()

bot.setConfig({
    prefix: '!',
})

bot.on('readyState', client => {
    console.log(chalk.yellow('[ready]'))
    console.log(`client.user.tag: ${client.user.tag}`)
    console.log(`client.host.tag: ${client.owner.tag}`)

    if (client.owner instanceof discord.User) {
        client.owner.send('제가 왔어요 주인님!')
    }
})

const bookmarkCache: {
    [key: string]: string
} = {}

bot.middlewareManager.addCommand(
    new MSG.Command(
        (ctx: MSG.Context) => ctx.header.currentCommand === 'bookmark',
        async (ctx: MSG.Context) => {
            const res = await new MSG.MiddlewareChainRunner([
                new MSG.Command(
                    (ctx: MSG.Context) => ctx.header.currentCommand === 'add',
                    (ctx: MSG.Context) => {
                        const bookmarkName = ctx.ex?.currentArgs?.[0]
                        const bookmarkData = ctx.ex?.currentArgs?.[1]

                        if (!bookmarkName)
                            ctx.msg.reply('북마크 이름을 써주세요!')
                        else if (bookmarkName in bookmarkCache)
                            ctx.msg.reply(
                                `\`${bookmarkName}\` 이라는 북마크는 이미 있어요!`,
                            )
                        else if (!bookmarkData)
                            ctx.msg.reply('북마크 내용을 써주세요!')
                        else {
                            bookmarkCache[bookmarkName] = bookmarkData

                            ctx.msg.reply(
                                `\`${bookmarkData}\` 를 \`${bookmarkName}\` 라는 이름으로 저장했어요!`,
                            )
                        }
                        return ctx.finish()
                    },
                    {
                        name: 'add bookmark',
                        description: 'add a bookmark in cache',
                    },
                ),
                new MSG.Command(
                    (ctx: MSG.Context) =>
                        ctx.header.currentCommand === 'delete',
                    (ctx: MSG.Context) => {
                        const bookmarkName = ctx.ex?.currentArgs?.[0]

                        if (!bookmarkName)
                            ctx.msg.reply('북마크 이름을 써주세요!')
                        else if (!(bookmarkName in bookmarkCache))
                            ctx.msg.reply(
                                `\`${bookmarkName}\` 라는 북마크를 찾을 수 없습니다!`,
                            )
                        else {
                            delete bookmarkCache[bookmarkName]
                            ctx.msg.reply(
                                `\`${bookmarkName}\` 북마크를 삭제했습니다!`,
                            )
                        }

                        return ctx.finish()
                    },
                    {
                        name: 'delete bookmark',
                    },
                ),
                new MSG.Command(
                    (ctx: MSG.Context) =>
                        ctx.header.currentCommand === 'update',
                    (ctx: MSG.Context) => {
                        const bookmarkName = ctx.ex?.currentArgs?.[0]
                        const bookmarkData = ctx.ex?.currentArgs?.[1]

                        if (!bookmarkName)
                            ctx.msg.reply('북마크 이름을 말해 주세요!')
                        else if (!(bookmarkName in bookmarkCache))
                            ctx.msg.reply(
                                `\`${bookmarkName}\` 이라는 북마크가 없습니다!`,
                            )
                        else if (!bookmarkData)
                            ctx.msg.reply('수정할 데이터를 말씀헤 주세요!')
                        else {
                            bookmarkCache[bookmarkName] = bookmarkData

                            ctx.msg.reply(
                                `\`${bookmarkName}\` 를 \`${bookmarkData}\` 로 수정했습니다!`,
                            )
                        }

                        return ctx.finish()
                    },
                    {
                        name: 'update bookmark',
                    },
                ),
                new MSG.Command(
                    (ctx: MSG.Context) => ctx.header.currentCommand === 'list',
                    (ctx: MSG.Context) => {
                        if (Object.keys(bookmarkCache).length === 0) {
                            ctx.msg.reply(
                                '아직 아무 북마크도 저장되지 않았어요!',
                            )
                            ctx.msg.channel.send(
                                '`!bookmark add <이름> <값>` 명령어로 새 북마크를 추가해 보세요!',
                            )

                            return ctx.finish()
                        }

                        ctx.msg.channel.send(
                            (() => {
                                const resStr = []
                                let i = 0
                                for (const bookmarkName in bookmarkCache) {
                                    i += 1
                                    resStr.push(
                                        `[${i}] ${bookmarkName} = ${bookmarkCache[bookmarkName]}`,
                                    )
                                }
                                return `\`\`\`toml\n${resStr.join(
                                    '\n',
                                )}\n\`\`\``
                            })(),
                        )
                        return ctx.finish()
                    },
                    {
                        name: 'show list of bookmarks',
                    },
                ),
                new MSG.Command(
                    MSG.Command.alwaysTrue,
                    (ctx: MSG.Context) => {
                        const commandUsage = [
                            {
                                usage: `add <이름> <값>`,
                                doWhat: '새 북마크를 저장해요!',
                            },

                            {
                                usage: `delete <이름>`,
                                doWhat: '기존의 북마크를 삭제해요!',
                            },

                            {
                                usage: `update <이름> <값>`,
                                doWhat: '기존의 북마크를 변경해요!',
                            },

                            {
                                usage: `list`,
                                doWhat: '모든 북마크들의 목록을 볼 수 있어요!',
                            },
                        ]

                        ctx.msg.channel.send(
                            commandUsage
                                .map(
                                    ({ usage, doWhat }) =>
                                        `\`${'!bookmark'} ${usage}\`: ${doWhat}`,
                                )
                                .join('\n'),
                        )
                        return ctx
                    },
                    {
                        name: 'bookmark command default',
                    },
                ),
            ]).run(ctx)

            return res
        },
        {
            name: 'bookmark',
        },
    ),
)

bot.login('ODM5ODc1NTAxNjM2MzIxMjgw.YJQBAw.3o8xUS2zk0b9ihNQVHQfqRUS4wI')
