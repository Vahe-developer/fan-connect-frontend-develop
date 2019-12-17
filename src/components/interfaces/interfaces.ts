import * as React from 'react'

export type IInput = {
    target : {
        name :string,
        value : number | string
    }
} &  React.MouseEvent
