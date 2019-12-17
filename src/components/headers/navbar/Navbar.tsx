import React                 from 'react'
import {Col, Container, Row} from 'reactstrap'
import Preferences           from './Preferences'
import Logo                  from './logo/Logo'
import Profile               from './Profile'
import './navbar.scss'
import {Club}                from '@myfan/base'
import {url}                 from '@myfan/commons'
import {withStore}           from '@myfan/store'
import {Types}               from 'Redux'

function NavBar({auth}: { auth: Types.Auth.AuthT }): JSX.Element {

    const showLinks = (): boolean => {

        if (Club.isEnabledNavTabs && (
            url.getPathName().includes('/p') ||
            url.getParam('page')
        )) return true

        return !!auth.isAuthenticated


    }

    const show = showLinks()

    const bars = [
        // @ts-ignore
        <Profile showLinks={show}/>,
        <Logo/>,
        // @ts-ignore
        <Preferences showLinks={show}/>,
    ]

    return (
        <section className={'fcsp-navbar'} style={{background: Club.navbarBg}}>
            <Container md={12}>
                <Row>
                    {bars.map((bar, key) => <Col className={'navbar-links'} md={4} xs={4} key={key}> {bar} </Col>)}
                </Row>
            </Container>
        </section>
    )

}

export default withStore(NavBar, (ctx: { auth: any; }) => ({auth: ctx.auth}))
