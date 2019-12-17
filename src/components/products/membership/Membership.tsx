import * as React                           from 'react'
import {useState, createContext, useEffect} from 'react'
import {Pages, Loadable, Container}         from '@myfan/web-components'
import {Club}                               from '@myfan/base'
import {object}                             from '@myfan/commons'
import {IntlHtmlText}                       from '../../intl/IntlText'
import {withRouter}                         from 'react-router-dom'
import {withContext, withStore}             from '@myfan/store'
import {renderRoutes}                       from 'react-router-config'
import {Products}                           from '@myfan/pages'
import {Types, GlobalState, GlobalContextT} from 'Redux'

const {Products: ProductsView} = Pages
const {Header}                 = ProductsView

export const MembershipContext = createContext<any>({})

type MembershipAddress = {
    gender: string,
    firstName: string,
    middleName: string,
    lastName: string,
    birthDate: string,
    phone: string,
    country: string,
    city: string,
    street: string,
    houseNumber: string,
    postalCode: string,
    additionalAddress: string
}

const transformUserData = (data: Types.Profile.UserDataT): MembershipAddress => {
    const {gender, firstName, middleName, lastName, birthday, phone, country, city, street, housenumber, zip, additionalAddress} = data
    return {
        gender           : gender,
        firstName        : firstName,
        middleName       : middleName,
        lastName         : lastName,
        birthDate        : birthday,
        phone            : phone,
        country          : country,
        city             : city,
        street           : street,
        houseNumber      : housenumber,
        postalCode       : zip,
        additionalAddress: additionalAddress,
    }
}

// @ts-ignore
const MembershipView = ({route, routePrefix, profile: {userData}, products}) => {

    // const [fanConnectPlusState, setFanConnectPlusState] = useState()
    const [index, setIndex]                     = useState(0)
    const [membershipState, setMembershipState] = useState({
        data   : products.membership,
        options: {
            membershipType               : 'passive',
            sportType                    : 'afm',
            discount                     : false,
            discountFile                 : undefined,
            discountFileUuid             : undefined,
            familyMembersMembershipNumber: '',
        },
        address: transformUserData(userData),
        payment: {
            payerName: '',
            iban     : '',
            bic      : '',
        },
    })

    useEffect(() => {
        setMembershipState((prev) => ({
            ...prev,
            data: products.membership,
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products.membership])

    useEffect(() => {
        setMembershipState((prev) => ({
            ...prev,
            address: transformUserData(userData),
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData])

    return (
        <>
            {/*<SliderNavbar
                routes={[
                    {
                        path:  '/product/membership',
                        title: intl.formatMessage({id: 'membership.main'})
                    },
                    {
                        path:  '/product/fanconnectplus',
                        title: intl.formatMessage({id: 'menu.fanconnect.plus'})
                    },
                ]}
            />*/}
            <Container size={'extrasmall'}>
                <Loadable loading={object.isEmpty(membershipState.data)}>
                    <Header
                        title={
                            IntlHtmlText(
                                membershipState.data.titleID,
                                {
                                    color: Club.navbarBg,
                                },
                            )
                        }
                    />
                    <MembershipContext.Provider value={{
                        membership: {
                            currentIndex   : index,
                            setCurrentIndex: setIndex,
                            state          : membershipState,
                            setState       : setMembershipState,
                        },
                        // fanConnectPlus: {
                        //     state:    fanConnectPlusState,
                        //     setState: setFanConnectPlusState
                        // }
                    }}>
                        {renderRoutes(route.routes, {routePrefix: routePrefix + '/membership'})}
                    </MembershipContext.Provider>
                </Loadable>
            </Container>
        </>
    )
}

export default withRouter(
    withContext(
        Products.withProducts(
            withStore(MembershipView, (state: GlobalState) => ({profile: state.profile})),
        ),
        (ctx: GlobalContextT) => ({intl: ctx.intl}),
    ),
)

