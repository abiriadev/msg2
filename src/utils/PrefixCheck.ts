import Context from '../class/Context'

export default (context: Context) =>
    context.msg.content.startsWith(context.ex.bot.config.prefix)
