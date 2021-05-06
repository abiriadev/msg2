import Context from './class/Context'

type middleware = {
    cond: (ctx: Context) => boolean
    act: (ctx: Context) => Context
}

type n<T> = T | null
