import Context from './Context'

class Command {
    name?: string
    description?: string

    constructor(
        public cond: (ctx: Context) => boolean,
        public executor: (ctx: Context) => Context | null,
        {
            name,
            description,
        }: {
            name?: string
            description?: string
        } = {},
    ) {
        this.name = name
        this.description = description
    }
}

export default Command
