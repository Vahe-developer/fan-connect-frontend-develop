import {ClientApp}                                   from '@myfan/clients'
import Feedback                                      from 'components/feedback/Feedback'
import AddressInfo                                   from 'components/profile/address-info/AddressInfo'
import PersonalData                                  from 'components/profile/personal-data/PersonalData'
import ProfileLayout                                 from 'components/profile/ProfileLayout'
import React, {useEffect}                            from 'react'
import CompareProfile                                from './compare-profile/CompareProfile'
import {Types as CommonTypes}                        from '@myfan/commons'
import {Loading, StyledTabs}                         from '@myfan/web-components'
import {withStore, withContext, useDispatch}         from '@myfan/store'
import {actions, GlobalState, Types, GlobalContextT} from 'Redux'
import {withRouter}                                  from 'react-router-dom'

type Props = {
    profile: Types.Profile.ProfileState
    intl: CommonTypes.IntlShape
    height: number,
    left: number,
    isTablet: boolean,
    isMobile: boolean,
    route: any
}

export enum ComponentEnum {
    personalData = 'personalData',
    addressInfo  = 'addressInfo',
    feedback     = 'feedback',
}

function ProfileRedirector({profile, height, left, intl: {formatMessage}, isTablet, isMobile}: Props) {

    const dispatch = useDispatch()

    useEffect(() => {
        if (!profile.loading) return
        actions.profile.getProfileData({dispatch})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderComponent = () => {

        if (profile.loading) return <Loading/>

        if (
            ClientApp.needToBeChoosenWhichData(profile.userData)
        )
            return <CompareProfile/>

        return (
            <>
                <StyledTabs
                    tabs={[
                        {name: formatMessage({id: 'personal.data'})},
                        {name: formatMessage({id: 'address.info'})},
                        {name: formatMessage({id: 'feedback'})},
                    ]}
                    styles={{height, left: isTablet ? 0 : left}}
                    isTablet={isTablet}
                    isMobile={isMobile}
                >
                    <PersonalData data={profile.userData}/>
                    <AddressInfo data={profile.userData}/>
                    <Feedback/>
                </StyledTabs>
            </>
        )
    }

    return (
        <ProfileLayout>
            {renderComponent()}
        </ProfileLayout>
    )

}

export default withRouter(
    withStore(
        withContext(
            ProfileRedirector, (ctx: GlobalContextT) => ({
                intl    : ctx.intl,
                height  : ctx.navBarHeight,
                left    : ctx.layoutLeftSide,
                isTablet: ctx.isTablet,
                isMobile: ctx.isMobile,
            })),
        (ctx: GlobalState) => ({profile: ctx.profile}),
    ),
)
