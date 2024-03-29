const contextHeaderDefaultOptions = {
    depth: 0,
}

type contextHeaderDefaultOptionsAdditionalOverwrite = {
    // hitCommand: string | null
}

type contextHeaderOptions =
    | Partial<
          {
              [K in keyof typeof contextHeaderDefaultOptions]: typeof contextHeaderDefaultOptions[K]
          }
      >
    | contextHeaderDefaultOptionsAdditionalOverwrite

class ContextHeader {
    private depth: number
    getDepth() {
        return this.depth
    }
    setDepth(depth: number): this {
        if (Number.isNaN(depth))
            throw new TypeError(`argument 'depth' must be a valid number`)
        if (depth < 0)
            throw new RangeError(`argument 'depth' must over or same than zero`)
        this.depth = depth
        return this
    }
    increaseDepth(): this {
        this.depth += 1
        return this
    }
    diminishDepth(): this {
        this.depth -= 1
        return this
    }

    private isHit = false
    getIsHit() {
        return this.isHit
    }
    setHit(): this {
        this.isHit = true
        return this
    }

    private hitCommand: string | null = null
    getHitCommand() {
        return this.hitCommand
    }
    setHitCommand(hitCommand: string) {
        this.hitCommand = hitCommand
        return this
    }

    private isFinished = false
    getIsFinished() {
        return this.isFinished
    }
    setFinish(): this {
        this.isFinished = true
        return this
    }

    currentCommand: string | null = null

    constructor(options: contextHeaderOptions = {}) {
        const overwrittenOptions = {
            ...contextHeaderDefaultOptions,
            ...options,
        }

        this.depth = overwrittenOptions.depth
    }
}

export default ContextHeader
