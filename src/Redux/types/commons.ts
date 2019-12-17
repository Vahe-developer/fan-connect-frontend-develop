export type ActionT = {
    type: string,
    payload: any
}

export type DispatchT = {
    (value: ActionT): void
}

export type DropDownT = {
    id: number | string,
    title: any,
    selected: boolean,
    style?: { [key: string]: string }
}

export type ValidationT = {
    [key: string]: string
}
