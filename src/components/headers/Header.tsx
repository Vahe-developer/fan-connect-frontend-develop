import React                                  from 'react'
import {MobileHeader, Logo, AppBar, UserMenu} from '@myfan/web-components'
import './header.scss'
import {withContext}                          from '@myfan/store'
import {Club}                                 from '@myfan/base'
import LanguageIcons                          from '../intl/LanguageIcons'
import {Routes, Types}                        from '@myfan/commons'
import {GlobalContextT}                       from 'Redux'
import {withRouter, RouteComponentProps}      from 'react-router-dom'
import BackButton                             from './BackButton'

type Props = {
                 isTablet: boolean,
                 toggleSidebar: () => void,
                 intl: Types.IntlShape,
                 navBarHeight: number
                 showSidebar: boolean
                 history: any
             } & RouteComponentProps<any>

const Header = ({isTablet, toggleSidebar, intl: {formatMessage: intl}, navBarHeight, showSidebar, history}: Props) => {

    const items: any = []

    Club.isEnabledTranslations && items.push(LanguageIcons)

    const FinalHeader = () => {
        switch (isTablet) {
            case true:
                return (
                    <MobileHeader
                        height={navBarHeight}
                        leftComponent={<BackButton/>}
                        centerComponent={<Logo height={navBarHeight}/>}
                        rightComponent={<UserMenu height={navBarHeight} subMenus={[
                            // @ts-ignore
                            {
                                title    : intl({id: 'menu.my.data'}),
                                subTitles: [
                                    {name: intl({id: 'menu.profile.data'}), route: Routes.profile.personalData.build()},
                                    {name: intl({id: 'menu.address.data'}), route: Routes.profile.addressInfo.build()},
                                    {name: intl({id: 'menu.feedback'}), route: Routes.profile.feedback.build()},
                                ],
                            },
                            {
                                title    : intl({id: 'menu.my.membership'}),
                                subTitles: [
                                    {
                                        name : intl({id: 'menu.membership'}),
                                        route: Routes.product.membership.introduction.build(),
                                    },
                                    /*
                                        {name: intl({id: 'menu.fanconnect.plus'}), route: '/product/fanconnectplus'},
                                    */
                                ],
                            },
                        ]}/>}
                    />
                )
            default:
                return (
                    <AppBar
                        toggleOpen={toggleSidebar}
                        logoSrc={Club.logo}
                        items={items}
                        height={navBarHeight}
                        showSidebar={showSidebar}
                    />
                )
        }
    }

    return <FinalHeader/>
}

export default withContext(withRouter(Header), (ctx: GlobalContextT) => ({
    intl         : ctx.intl,
    isTablet     : ctx.isTablet,
    toggleSidebar: ctx.toggleSidebar,
    navBarHeight : ctx.navBarHeight,
    showSidebar  : ctx.showSidebar,
}))
