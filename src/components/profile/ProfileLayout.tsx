import {withContext}    from '@myfan/store'
import React            from 'react'
import {GlobalContextT} from 'Redux'

const ProfileLayout: React.FC = ({children}) => {
    return (
        <>
            {children}
        </>
    )
}

type Props = {
    height: number
    children: JSX.Element
}

export const Content = withContext(({children, height}: Props) => {

    return (
        <div style={{
            marginTop: height * 2,
        }}>
            {children}
        </div>
    )
}, (ctx: GlobalContextT) => ({height: ctx.navBarHeight}))

export default withContext(ProfileLayout, (ctx: GlobalContextT) => ({height: ctx.navBarHeight}))
