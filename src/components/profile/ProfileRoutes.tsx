import {ComponentEnum}            from 'components/profile/ProfileRedirector'
import React                      from 'react'
import {withContext}              from '@myfan/store'
import {UnderlinedSlider, styled} from '@myfan/web-components'
import {Types}                    from '@myfan/commons'
import {GlobalContextT}           from 'Redux'

const RoutesBox = styled.div`
    min-width : 160px;
    height : 5 6px;
    display: inline-block;
    line-height : 56px;
    text-align: center;  
    cursor : pointer;
`

const ProfileNavContainer: any = styled.div`
    position  : fixed;
    right : 0;
    z-index : 1100;
    background: white;  
`

type Props = {
    navBarHeight: number
    left: number
    routePrefix: string
    isTaglet: boolean
    intl: Types.IntlShape
    setComponent(component: ComponentEnum): void
    currentComponent: ComponentEnum
}

const ProfileRoutes: React.FC<Props> = ({
                                            setComponent,
                                            currentComponent,
                                            navBarHeight,
                                            left,
                                            routePrefix,
                                            isTaglet,
                                            intl: {formatMessage},
                                            children,
                                        }) => {


    return (
        <ProfileNavContainer
            style={{
                top : navBarHeight,
                left: isTaglet ? 0 : left,
            }}>
            <UnderlinedSlider
                forceGrid
                components={[ComponentEnum.personalData, ComponentEnum.addressInfo, ComponentEnum.feedback]}
                currentComponent={currentComponent}
            >
                <RoutesBox
                    className={`sub-title`}
                    onClick={() => setComponent(ComponentEnum.personalData)}
                >
                    {formatMessage({id: 'personal.data'})}
                </RoutesBox>
                <RoutesBox
                    className={`sub-title `}
                    onClick={() => setComponent(ComponentEnum.addressInfo)}
                >
                    {formatMessage({id: 'address.info'})}
                </RoutesBox>
                <RoutesBox
                    className={`sub-title `}
                    onClick={() => setComponent(ComponentEnum.feedback)}
                >
                    {formatMessage({id: 'feedback'})}
                </RoutesBox>
            </UnderlinedSlider>
            {children}
        </ProfileNavContainer>
    )
}

export default withContext(ProfileRoutes, (ctx: GlobalContextT) => ({
    navBarHeight: ctx.navBarHeight,
    left        : ctx.layoutLeftSide,
    isTaglet    : ctx.isTablet,
    intl        : ctx.intl,
}))
