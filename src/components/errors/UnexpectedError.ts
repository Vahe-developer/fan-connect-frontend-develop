export class UnexpectedError extends Error {
    constructor(message: string | undefined) {
        super(message)
        this.name = 'UnexpectedError'
        // @ts-ignore
        this.message = message
    }

    toJSON() {
        return {
            error: {
                name: this.name,
                message: this.message,
                stacktrace: this.stack
            }
        }
    }
}
