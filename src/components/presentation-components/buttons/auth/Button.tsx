import React  from 'react'
import './button.scss'
import {Club} from '@myfan/base'

export type IButton = {
    onClick?: () => void | Promise<void>,
    disabled?: boolean,
    className?: string,
    style?: { [key: string]: string },
    children: any
}

const Button = React.forwardRef((
    {
        onClick,
        disabled,
        className = '',
        style = {},
        children,
    }: IButton, ref: any) => {

    let css = {}

    if (!className || !className.includes('ghost')) {
        css = {
            background: disabled ? 'rgb(162, 163, 170)' : Club.btnBg,
            color     : Club.btnC,
        }
    }

    return (
        <button
            ref={ref}
            className={Club.name + ' button ' + className}
            style={{...css, ...style}}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )

})

export default Button
