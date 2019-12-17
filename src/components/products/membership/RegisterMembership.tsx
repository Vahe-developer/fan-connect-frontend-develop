import React, {useEffect, useState}                  from 'react'
import {request}                                     from '@myfan/base'
import {navigate, Types as CommonTypes}              from '@myfan/commons'
import {Validator}                                   from '@myfan/validation'
import {withContext, withStore, useDispatch}         from '@myfan/store'
import {
    ShadowedContainer,
    MaterialInput,
    MaterialButton,
    styled,
    Birthday,
}                                                    from '@myfan/web-components'
import {withRouter}                                  from 'react-router-dom'
import {IntlHtmlText}                                from '../../intl/IntlText'
import {actions, Types, GlobalState, GlobalContextT} from 'Redux'

type TRegisterMembership = {
    userData: {
        firstName: string,
        lastName: string,
        birthDate: string
    },
    intl: CommonTypes.IntlShape,
    profile: Types.Profile.ProfileState,
    routePrefix: string
    errors: { birthday: any }
}

const WithMargin = styled.div`
    margin-top : 8px;
`

const RegisterMembership = ({profile: {userData, loading}, intl, errors, routePrefix}: TRegisterMembership) => {

    const dispatch = useDispatch()

    const [data, setData] = useState({
        firstName       : userData.firstName,
        lastName        : userData.lastName,
        birthDate       : userData.birthday,
        membershipNumber: '',
    })

    useEffect(() => {
        setData({
            firstName       : userData.firstName,
            lastName        : userData.lastName,
            birthDate       : userData.birthday,
            membershipNumber: '',
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])


    // @ts-ignore
    const validate = (data): [boolean, () => void] => {

        const [errors, isEmpty]: [any, boolean] = Validator({
            firstName       : 'required|string',
            lastName        : 'required|string',
            birthDate       : 'required|date',
            membershipNumber: 'required|containsLetterOrNumber|membershipNumberMax:9',
        }, data)

        return [isEmpty, () => actions.errors.set(errors, dispatch)]
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //e.persist()
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })

        dispatch(
            actions.errors.remove(
                {
                    name: [e.target.name],
                },
            ),
        )
    }

    const sendData = async (data: { firstName: string, lastName: string, birthDate: string, membershipNumber: string }) => {
        const {firstName, lastName, birthDate, membershipNumber} = data
        let body                                                 = {
            requestType: 'LINKING_REQUEST',
            number     : membershipNumber,
            address    : [
                {name: 'firstName', value: firstName},
                {name: 'lastName', value: lastName},
                {name: 'birthDate', value: birthDate},
            ],
        }

        return await request.post('/v2/membership', body)
    }

    return (
        <>
            <ShadowedContainer styles={{marginTop: '32px', paddingBottom: '24px'}}>
                <WithMargin>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : data.firstName,
                            onChange: handleChange,
                        }}
                        label={intl.formatMessage({id: 'firstName'})}
                        name={'firstName'}
                        errors={errors}
                    />
                </WithMargin>
                <WithMargin>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : data.lastName,
                            onChange: handleChange,
                        }}
                        label={intl.formatMessage({id: 'lastName'})}
                        name={'lastName'}
                        errors={errors}
                    />
                </WithMargin>
                <WithMargin>
                    <Birthday
                        required
                        name={'birthDate'}
                        onChange={handleChange}
                        value={data.birthDate}
                        errors={errors}
                    />
                </WithMargin>
                <WithMargin>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : data.membershipNumber,
                            onChange: handleChange,
                        }}
                        label={intl.formatMessage({id: 'membership.number'})}
                        name={'membershipNumber'}
                        errors={errors}
                    />
                </WithMargin>
                <div
                    style={{marginTop: '32px'}}
                >
                    <MaterialButton
                        onClick={async () => {
                            const [success, dispatchErrors] = validate(data)

                            if (!success) {
                                dispatchErrors()
                                return
                            }

                            try {
                                const response = await sendData(data)
                                if (response.data.success) {
                                    await actions.profile.getProfileData({dispatch})
                                    dispatch(actions.message.set({msg: IntlHtmlText('existing.membership.success')}))
                                    navigate(routePrefix + '/success')
                                }
                            } catch (error) {
                                dispatch(actions.notification.set({
                                    msg  : error.data.message,
                                    color: 'danger',
                                }))
                            }
                        }}
                    >
                        {intl.formatMessage({id: 'membership.link.existing.account'})}
                    </MaterialButton>
                </div>
            </ShadowedContainer>
            <div>
                <div className={'sub-title'} style={{cursor: 'pointer', marginTop: '24px'}}
                     onClick={() => navigate(routePrefix + '/register-steps')}
                    // @ts-ignore
                     dangerouslySetInnerHTML={{
                         __html: intl.formatHTMLMessage({id: 'register.new.membership'}),
                     }}
                >

                </div>
            </div>
        </>
    )
}

export default withRouter(withStore(
    withContext(
        RegisterMembership,
        (ctx: GlobalContextT) => ({intl: ctx.intl}),
    ),
    (state: GlobalState) => ({profile: state.profile, errors: state.errors})),
)

