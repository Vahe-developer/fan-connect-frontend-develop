import {RoutesEnum}                      from '@myfan/commons/dist/Routes'
import {withContext}                     from '@myfan/store'
import React                             from 'react'
import {GlobalContextT}                  from 'Redux'
import Header                            from '../headers/Header'
import {renderRoutes}                    from 'react-router-config'
import FooterComponent                   from '../footer/FooterComponent'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import Notification                      from '../notification/Notification'
import BetaText                          from '../beta/BetaText'
import Tracking                          from './Tracking'
import {Club, User}                      from '@myfan/base'
import {Url, Routes, Types}              from '@myfan/commons'
import {
    ScrollUpButton,
    MainLayout,
    SideBar,
    MainContent,
    PageContainer,
    styled,
}                                        from '@myfan/web-components'

const MainContainer = styled.div`
    min-height: 500px;

    @media(max-width: 760px) {
      min-height: 200px;
    }
`

type Props = {
                 intl: Types.IntlShape,
                 isTablet: boolean,
                 route: any,
                 showSidebar: boolean
                 sidebarOpen: boolean
                 navBarHeight: number
             } & RouteComponentProps

function Layout({route, intl, isTablet, showSidebar, sidebarOpen, navBarHeight}: Props) {

    const menuItems = [
        {
            name: intl.formatMessage({id: 'home'}),
            icon: 'fas fa-home', link: Routes.home.build(),
        },
        {
            name: intl.formatMessage({id: 'nav.profile'}),
            icon: 'fa-user-alt',
            link: User.hasValidSession() ? Routes.profile.build() : Routes.authorization.login.build(),
        },
        {
            name: intl.formatMessage({id: 'nav.preferences'}),
            icon: 'fa-map-marked-alt', link: Routes.preference.build(),
        },
        /*{
            name: intl.formatMessage({id: 'feedback'}),
            icon: 'fa-comment-dots', link: '/feedback',
        },*/
        // {name: 'Logout', icon: 'fa-sign-out-alt', link: '/logout'},
    ]

    return (
        <>
            {Club.isEnabledHubspot && (
                <Tracking/>
            )}
            <Header/>
            <BetaText/>
            <MainLayout
                sidebarOpen={sidebarOpen}
                isTablet={isTablet}
                showSidebar={showSidebar}
                height={navBarHeight}
            >
                <SideBar
                    sidebarOpen={sidebarOpen}
                    height={navBarHeight}
                    menuItems={menuItems}
                />
                <MainContent>
                    <Notification/>
                    <MainContainer>
                        <PageContainer
                            paddingExcludes={[RoutesEnum.HOME, RoutesEnum.PROFILE]}
                        >
                            {renderRoutes(route.routes)}
                        </PageContainer>
                    </MainContainer>
                </MainContent>
            </MainLayout>
            {isTablet && new Url().includes('/news') && <ScrollUpButton/>}
            <FooterComponent/>
        </>
    )
}

export default withRouter(withContext(Layout, (ctx: GlobalContextT) => ({
    intl        : ctx.intl,
    sidebarOpen : ctx.sidebarOpen,
    isTablet    : ctx.isTablet,
    showSidebar : ctx.showSidebar,
    navBarHeight: ctx.navBarHeight,
})))
