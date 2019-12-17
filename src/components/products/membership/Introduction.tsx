import React, {useContext}       from 'react'
import {Global, navigate, Types} from '@myfan/commons'
import {Pages, styled}           from '@myfan/web-components'
import {withContext}             from '@myfan/store'
import {GlobalContextT}          from 'Redux'
import {MembershipContext}       from './Membership'

const Footer = styled.div`
    font-size: 16px;
    cursor : pointer;
    padding: 0 16px;
`

type Props = {
    intl: Types.IntlShape,
    routePrefix: string
}

const Introduction = ({intl, routePrefix}: Props) => {
    const {membership: {state}} = useContext(MembershipContext)

    return (
        <>
            <Pages.Products.Introduction
                data={state.data}
                onClick={() => {
                    Global.window.scrollTo({
                        top     : 0,
                        behavior: 'smooth',
                    })
                    navigate(routePrefix + '/register-steps')
                }}
            />
            <Footer
                onClick={() => navigate(routePrefix + '/register-membership')}
                // @ts-ignore
                dangerouslySetInnerHTML={{
                    __html: intl.formatHTMLMessage({id: 'already.have.membership'}),
                }}
            >

            </Footer>
        </>
    )
}


export default withContext(Introduction, (ctx: GlobalContextT) => ({intl: ctx.intl}))

