import {navigate, Routes, Types}             from '@myfan/commons'
import {withContext, withStore, useDispatch} from '@myfan/store'
import React, {useEffect}                    from 'react'
import {Banner, LandingContainer}            from '@myfan/web-components'
import {Home as HomePage}                    from '@myfan/pages'
import {Loadable}                            from '@myfan/web-components'
import FcspConnect                           from './FcspConnect'
import {Club}                                from '@myfan/base'
import InfoConnect                           from './InfoConnect'
import FcspMembership                        from './FcspMembership'
import {actions}                             from 'Redux'

type Props = {
    home: HomePage.HomeT,
    intl: Types.IntlShape
}

const Home = ({home, intl: {formatMessage}}: Props) => {

    const dispatch = useDispatch()

    useEffect(() => {
        if (!home.loading) {
            return
        }
        actions.home.getHomeData({dispatch})

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [home])


    return (
        <Loadable loading={home.loading}>
            <Banner
                background={`${Club.backendUrl.replace('/api', '')}${Club.landingPageBannerImage}`}
                center={
                    <div>
                        <div
                            className={'sub-title bold'}
                            style={{color: 'white'}}
                        >
                            {formatMessage({id: 'hello'})}
                        </div>
                        <h3
                            className={'bold'}
                            style={{color: 'red'}}>
                            {`${home.user.firstName} ${home.user.lastName}`}
                        </h3>
                    </div>
                }
            />

            <LandingContainer
                styles={{
                    background: '#efefef',
                }}
                title={'FCSP connect'}
                content={<FcspConnect apps={home.apps}/>}
                footer={{
                    text   : formatMessage({id: 'show.all'}).toUpperCase(),
                    onClick: () => navigate(Routes.fcspConnect.build()),
                }}
            />
            <LandingContainer
                title={'Info connect'}
                content={<InfoConnect channels={home.channels}/>}
                footer={{
                    text   : formatMessage({id: 'show.all'}).toUpperCase(),
                    onClick: () => navigate(Routes.preference.build()),
                }}
            />
            {home.membership.length && (
                <LandingContainer
                    title={formatMessage({id: home.membership[0].titleKey})}
                    content={<FcspMembership data={home.membership[0]}/>}
                    footer={{
                        text   : '',
                        onClick: void 0,
                    }}
                />
            )}
        </Loadable>
    )
}

export default withStore(
    withContext(
        Home,
        (ctx: { intl: any }) => ({intl: ctx.intl})),
    (state: { home: any }) => ({home: state.home}))
