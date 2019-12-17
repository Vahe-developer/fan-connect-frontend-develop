import React, {useEffect}                    from 'react'
import {Container}                           from 'reactstrap'
import PersonalData                          from './personal-data/PersonalData'
import './profile.scss'
import LoginData                             from './login-data/LoginData'
import AddressInfo                           from './address-info/AddressInfo'
import MembershipData                        from './membership/Membership'
import {IntlHtmlText, IntlText}              from '../intl/IntlText'
import DataManagement                        from './data-management/DataManagement'
import Button                                from '../presentation-components/buttons/auth/Button'
import {IFieldNames}                         from '../constants/Fields'
import {IInput}                              from '../interfaces/interfaces'
import DropDown                              from '../dropdown/DropDown'
import {url, Types as CommonTypes}           from '@myfan/commons'
import {Loadable}                            from '@myfan/web-components'
import {Validator}                           from '@myfan/validation'
import Paypal                                from '../payment/paypal/Paypal'
import {Club, User}                          from '@myfan/base'
import {ClientSteps, ClientApp}              from '@myfan/clients'
//import Polls                                                 from './polls/Polls'
import Sections                              from './sections'
import {withStore, withContext, useDispatch} from '@myfan/store'
import {actions, Types}                      from 'Redux'

export function Profile({intl, profile}: { intl: CommonTypes.IntlShape, profile: Types.Profile.ProfileState }) {

    const dispatch = useDispatch()

    useEffect(() => {

        if (url.get('paypalconnect')) {
            dispatch(
                actions.notification.set({
                    msg   : intl.formatMessage({id: 'paypal.not.connected'}),
                    color : 'danger',
                    fadeIn: 10,
                }),
            )
        }

        for (let key in profile.userData) {
            if (!profile.userData.hasOwnProperty(key)) {
                continue
            }
            // @ts-ignore
            if (profile.requiredFields.includes(key) && !profile.userData[key]) {
                dispatch(
                    actions.notification.set({
                        msg  : intl.formatMessage({id: 'missing.data.screen.notification'}),
                        color: 'danger',
                    }),
                )
                return
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSave = async (): Promise<void> => {

        // TODO scroll to top
        if (!validate()) return

        await actions.profile.saveUserData({userData: profile.userData, dispatch})

        url.removeParam('requiredFields')
        ClientApp.removeMergingData()

        dispatch(
            actions.notification.set({
                msg  : intl.formatMessage({id: 'profile.saved.successfully'}),
                color: 'success',
            }),
        )

        if (url.getParam('redirect_uri')) {
            (() => ClientApp.redirectFactory(ClientSteps.CHECK_DATA_PERMISSION))()
        }

    }

    const validate = (): boolean => {
        const {userData, validation, requiredFields} = profile

        for (let key in userData) {
            if (!userData.hasOwnProperty(key)) {
                continue
            }
            // @ts-ignore
            if (requiredFields.includes(key) && !userData[key]) {
                dispatch(
                    actions.notification.set({
                        msg  : intl.formatMessage({id: 'fields.are.required'}),
                        color: 'danger',
                    }),
                )
                return false
            }
        }

        // @ts-ignore
        const [errors, isEmpty]: [any, (boolean)] = Validator(validation, userData)
        if (isEmpty) return true

        actions.errors.set(errors, dispatch)

        return false
    }

    const handleChange = (e: IInput): void => {

        let targetValue = e.target.value
        const name      = e.target.name

        const {userData, prevState} = profile

        // @ts-ignore
        if (!Number.isInteger(targetValue) && !targetValue.replace(/\s/g, '').length) {
            targetValue = ''
        }

        // @ts-ignore
        const value           = isNaN(targetValue) ? targetValue.trim() : targetValue
        const currentUserData = {...userData, [name]: value}

        dispatch(
            actions.profile.setProfileData({
                userData: currentUserData,
                disabled: (JSON.stringify(currentUserData) === JSON.stringify(prevState)),
            }),
        )

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                }),
        )
    }

    const {disabled, apps, requiredFields, userData, loading, players} = profile

    // @ts-ignore
    const placeholders: IFieldNames = {
        gender                       : intl.formatMessage({id: 'gender'}),
        firstName                    : intl.formatMessage({id: 'firstName'}),
        lastName                     : intl.formatMessage({id: 'lastName'}),
        birthday                     : intl.formatMessage({id: 'birthday'}),
        email                        : intl.formatMessage({id: 'email'}),
        phone                        : intl.formatMessage({id: 'phone'}),
        company                      : intl.formatMessage({id: 'company'}),
        street                       : intl.formatMessage({id: 'street'}),
        housenumber                  : intl.formatMessage({id: 'house.number'}),
        city                         : intl.formatMessage({id: 'city'}),
        zip                          : intl.formatMessage({id: 'zip'}),
        additionalAddress            : intl.formatMessage({id: 'additional.address'}),
        country                      : intl.formatMessage({id: 'country'}),
        membership                   : intl.formatMessage({id: 'membership'}),
        membershipMain               : intl.formatMessage({id: 'membership.main'}),
        membershipNumber             : intl.formatMessage({id: 'membership.number'}),
        membershipPerMonth           : intl.formatMessage({id: 'membership.perMonth'}),
        membershipCreatedAt          : intl.formatMessage({id: 'membership.createdAt'}),
        membershipNextPayment        : intl.formatMessage({id: 'membership.nextPayment'}),
        membershipMemberAddress      : intl.formatMessage({id: 'membership.memberAddress'}),
        membershipMemberAddressButton: intl.formatMessage({id: 'membership.memberAddress.button'}),
        membershipInfoTooltip        : intl.formatMessage({id: 'membership.info.tooltip'}),
        membershipInfo               : intl.formatMessage({id: 'membership.info'}),
        membershipStatus             : intl.formatMessage({id: 'membership.status'}),
        membershipPendingMessage     : intl.formatMessage({id: 'membership.pending.message'}),
        registerNewMembership        : intl.formatMessage({id: 'register.new.membership'}),
        registerNewMembershipButton  : intl.formatMessage({id: 'register.new.membership.button'}),
        registerNewMembershipMessage : intl.formatMessage({id: 'register.new.membership.message'}),
        linkExistingMembership       : intl.formatMessage({id: 'link.existing.membership'}),
        //membershipMembershipTypeLabel: intl.formatMessage({id: 'membership.membershipType.label'}),
    }

    const sectionProps = {
        onChange    : handleChange,
        data        : userData,
        placeholders: placeholders,
        required    : requiredFields,
    }

    let sections = [
        {
            name     : 'personalData',
            title    : 'personal.data',
            text     : 'personal.data.tooltip',
            dataFor  : 'personal',
            component: <PersonalData
                data={{
                    gender          : sectionProps.data.gender,
                    firstName       : sectionProps.data.firstName,
                    lastName        : sectionProps.data.lastName,
                    membershipNumber: sectionProps.data.membership.number,
                    birthDate       : sectionProps.data.birthday,
                    phone           : sectionProps.data.phone,
                }}
                loginData={{
                    email   : {
                        title: placeholders.email,
                        value: sectionProps.data.email,
                    },
                    password: {
                        title: placeholders.password,
                    },
                }}
            />,
        },
        {
            name     : 'loginData',
            title    : 'login.data',
            text     : 'contact.data.tooltip',
            dataFor  : 'contact',
            component: <LoginData
                email={{
                    title: placeholders.email,
                    value: sectionProps.data.email,
                }}
                password={{
                    title: placeholders.password,
                }}
            />,
        },
        {
            name     : 'addressInfo',
            title    : 'address.info',
            text     : 'address.info.tooltip',
            dataFor  : 'address',
            component: <AddressInfo data={{
                firstName        : sectionProps.data.firstName,
                lastName         : sectionProps.data.lastName,
                company          : sectionProps.data.company,
                street           : sectionProps.data.street,
                houseNumber      : sectionProps.data.housenumber,
                zip              : sectionProps.data.zip,
                city             : sectionProps.data.city,
                additionalAddress: sectionProps.data.additionalAddress,
                country          : sectionProps.data.country,
                phone            : sectionProps.data.phone,
            }}/>,
        },
        {
            name     : 'membership',
            title    : 'membership',
            text     : 'membership.info.tooltip',
            dataFor  : 'membership',
            component: <MembershipData data={userData} placeholders={placeholders}/>,
        },
        {
            name     : 'appConnections',
            title    : 'data.management',
            text     : 'managment.data.tooltip',
            dataFor  : 'managment',
            component: <DataManagement data={apps} removeAppConnection={actions.profile.removeAppConnection}/>,
        },
    ]

    //Club.isEnabledPolls && sections.unshift({
    //    name:      'polls',
    //    title:     'polls.header',
    //    text:      '',
    //    dataFor:   '',
    //    component: <Polls name={'Poll 1'}/>
    //})

    Club.isEnabledPaypal && sections.splice(5, 0, {
        name     : 'paypal',
        title    : 'paypal.header',
        text     : '',
        dataFor  : '',
        component: <Paypal/>,
    })

    Club.isEnabledFavoritePlayer && sections.push({
        name     : 'favPlayer',
        title    : 'favorite.player',
        text     : '',
        dataFor  : '',
        component: <DropDown
            name={'playerID'}
            data={players}
            title={intl.formatMessage({id: 'player.placeholder'})}
            onSelect={handleChange}
        />,
    })

    return (
        <Container className={'profile-main-container'}>
            <div
                className="fan-profile-text title"
                style={{
                    color: Club.navbarBg,
                }}
            >
                {IntlHtmlText('profile.header')}
            </div>
            <Loadable loading={loading}>
                <Sections sections={sections}/>
                <div className={'buttons'}>
                    <Button
                        className={'mediaMax'}
                        onClick={handleSave}
                        disabled={disabled}
                    >
                        {IntlText('save.changes')}
                    </Button>
                    <Button
                        onClick={() => User.logout('/authorization/login', {search: false})}
                        className={'ghost'}
                    >
                        <i className="fas fa-sign-out-alt logout-icon"/>
                        {IntlText('logout')}
                    </Button>
                </div>
            </Loadable>
        </Container>
    )
}

export default withStore(
    withContext(Profile),
    (state: { profile: any; }) => ({profile: state.profile}
    ),
)
