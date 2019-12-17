import {Club}   from '@myfan/base'
import {styled} from '@myfan/web-components'
import React    from 'react'

type ClickT = {
    onShowClick(data: React.MouseEvent<HTMLElement>): void,
    onEditClick(data: React.MouseEvent<HTMLElement>): void
}

export enum ViewModes {
    SHOW = 'show',
    EDIT = 'edit'
}


export const rightIcons = ({onShowClick, onEditClick}: ClickT) => ({
    'show': <i
        style={{color: Club.navbarBg}}
        className={'fas fa-pencil-alt'}
        onClick={onShowClick}
    />,
    'edit': <i
        style={{color: Club.navbarBg}}
        className={'fas fa-times pointer'}
        onClick={onEditClick}
    />,
})


export const PageHeader = styled.div`
    text-align: center;
    margin-bottom : 24px;
    text-transform: uppercase;
    color : ${Club.navbarBg}
`
