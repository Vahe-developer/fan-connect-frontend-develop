class Stack {

    items : Function[]
    listeners : Function[]

    constructor() {
        this.items     = []
        this.listeners = []
    }

    listen(callback : Function) {
        this.listeners.push(callback)
    }

    pop() {
        this.peek()()
        this.items.pop()
        this.listeners.forEach((callbackFunc) => {
            callbackFunc(this.items)
        })
    }

    push(value : Function) {

        if(this.peek() === undefined || this.peek().toString() !== value.toString()) {
            this.items.push(value)
            this.listeners.forEach((callbackFunc) => {
                callbackFunc(this.items)
            })
        }
    }

    peek() {
        return this.items[this.items.length - 1]
    }
}

export default Stack