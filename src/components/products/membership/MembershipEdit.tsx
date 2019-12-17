import React, {useEffect, useMemo, useState}         from 'react'
import {navigate, string, Types as CommonTypes}      from '@myfan/commons'
import {useDispatch, withStore, withContext}         from '@myfan/store'
import {request}                                     from '@myfan/base'
import {Validator}                                   from '@myfan/validation'
import {IntlHtmlText}                                from '../../intl/IntlText'
import PopupFan                                      from '../../popup/Popup'
import {actions, Types, GlobalContextT, GlobalState} from 'Redux'
import {
    MaterialCountrySelect,
    MaterialInput,
    MaterialButton,
    styled,
    MaterialSelect,
    MaterialTooltip,
}                                                    from '@myfan/web-components'

type PropsT = {
    profile: {
        userData: Types.Profile.UserDataT,
        prevState: Types.Profile.UserDataT,
    },
    intl: CommonTypes.IntlShape
    errors: {}
}

type EditableMembershipT = {
    address: {
        firstName: string,
        lastName: string,
        street: string,
        houseNumber: string,
        postalCode: string,
        city: string,
        country: string,
    },
    payment: {
        payerName: string,
        iban: string,
    },
    options: {
        membershipType: string
    }
}

const Layout = styled.section`
    margin-top: 16px;
`

const Field = styled.div`
`

const InlineField = styled.div`
    width: ${({width}: { width: number }) => width ? `${width}%` : `100%`}
    display: inline-block
`

// TODO check why Types.UserData.membership doesn't work
const getEditableData = (membership: any): EditableMembershipT => {
    return {
        address: {
            firstName  : membership.address.firstName,
            lastName   : membership.address.lastName,
            street     : membership.address.street,
            houseNumber: membership.address.houseNumber,
            postalCode : membership.address.postalCode,
            city       : membership.address.city,
            country    : membership.address.country,
        },
        payment: {
            payerName: membership.payment.payerName,
            iban     : membership.payment.iban,
        },
        options: {
            membershipType: membership.options.membershipType,
        },
    }
}

const MembershipEdit = (props: PropsT) => {

    const {intl, profile: {userData: {membership}, prevState}, errors} = props
    const [disabled, setDisabled]                                      = useState<boolean>(true)
    const dispatch                                                     = useDispatch()
    const [state, setState]                                            = useState<EditableMembershipT>(getEditableData(membership))

    const sportType = membership.options.sportType

    useEffect(() => {
        setState(getEditableData(membership))
    }, [membership])

    useEffect(() => {
        setDisabled(
            // TODO avoid only space changes
            JSON.stringify(state) === JSON.stringify(getEditableData(prevState.membership)),
        )
    }, [prevState.membership, state])

    const membershipTypes = useMemo(() => {

        return ['active', 'passive'].map((item: string) => {
            return {
                value: item,
                label: intl.formatMessage({id: item}),
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const name = e.target.name

        setState({
            ...state,
            address: {
                ...state.address,
                [name]: e.target.value,
            },
        })

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const handleChangeOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const name = e.target.name

        setState({
            ...state,
            options: {
                ...state.options,
                [name]: e.target.value,
            },
        })

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    // TODO fix typing in middle of input bug
    // TODO make reusable code for this and src/components/products/membership/steps/FinalStep.tsx handlePaymentChange
    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const name = event.target.name
        let value  = event.target.value.toUpperCase()

        if ('iban' === name) {
            value = string.removeSpaces(value)
        }

        setState({
            ...state,
            payment: {
                ...state.payment,
                [name]: value,
            },
        })

        dispatch(actions.errors.remove({name: name}))
    }

    const formatIBAN = (iban: string, size: number): string => {
        // don't allow more then 22 chars
        iban = string.removeSpaces(iban.slice(0, 22))

        const chunked = iban.match(new RegExp('[a-z0-9]{1,' + size + '}', 'gi'))

        return chunked ? chunked.join(' ') : iban
    }

    const validate = (data: { address: {}, payment: {} }): {
        payment: { success: boolean, dispatchErrors: () => void },
        address: { success: boolean, dispatchErrors: () => void },
    } => {

        const [paymentErrors, paymentIsEmpty]: [any, boolean] = Validator({
            payerName: 'required|string',
            iban     : 'required|min:22|max:22|containsLetterOrNumber',
        }, data.payment)

        const [addressErrors, addressIsEmpty]: [any, boolean] = Validator({
            firstName  : 'required|string',
            lastName   : 'required|string',
            street     : 'required',
            houseNumber: 'required',
            city       : 'required',
            postalCode : 'required|containNumber',
            country    : 'required|string',
        }, data.address)

        return {
            payment: {success: paymentIsEmpty, dispatchErrors: () => actions.errors.set(paymentErrors, dispatch)},
            address: {success: addressIsEmpty, dispatchErrors: () => actions.errors.set(addressErrors, dispatch)},
        }
    }

    const saveData = async (state: EditableMembershipT) => {
        const {address, payment} = state
        let data: {
            address: { name: string, value: any }[]
            payment: { name: string, value: any }[]
        }                        = {
            address: [],
            payment: [],
        }

        for (const key in address) {
            // @ts-ignore
            data.address.push({name: key, value: address[key]})
        }

        for (const key in payment) {
            // @ts-ignore
            data.payment.push({name: key, value: payment[key]})
        }

        return await request.post('/v2/membership/update', data)
    }

    return (
        <>
            <Layout className={'title-18'}>
                {intl.formatMessage({id: 'membership.edit.info.text'})}
            </Layout>
            <Layout>
                <Field style={{display: 'flex'}}>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : state.address.firstName,
                            onChange: handleAddressChange,
                        }}
                        label={intl.formatMessage({id: 'firstName'})}
                        name={'firstName'}
                        errors={errors}
                    />
                    <MaterialTooltip content={intl.formatMessage({id: 'membership.edit.tooltip.firstName'})}/>
                </Field>
                <Field style={{display: 'flex'}}>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : state.address.lastName,
                            onChange: handleAddressChange,
                        }}
                        label={intl.formatMessage({id: 'lastName'})}
                        name={'lastName'}
                        errors={errors}
                    />
                    <MaterialTooltip content={intl.formatMessage({id: 'membership.edit.tooltip.lastName'})}/>
                </Field>
                <Field style={{marginBottom: 20, display: 'flex'}}>
                    <InlineField width={100}>
                        <MaterialSelect
                            required={true}
                            value={state.options.membershipType}
                            handleChange={handleChangeOptionsChange}
                            inputProps={{
                                disabled: 'afm' === sportType,
                                required: true,
                                name    : 'membershipType',
                                id      : 'membershipType',
                            }}
                            items={membershipTypes}
                            label={intl.formatMessage({id: 'membership.type'})}
                            errors={errors}
                        />
                    </InlineField>
                    <InlineField width={100}>
                        <MaterialTooltip content={intl.formatMessage({id: 'membership.edit.tooltip.membershipType'})}/>
                    </InlineField>
                </Field>
                <Field>
                    <InlineField width={75}>
                        <MaterialInput
                            materialProps={{
                                required: true,
                                value   : state.address.street,
                                onChange: handleAddressChange,
                            }}
                            label={intl.formatMessage({id: 'street'})}
                            name={'street'}
                            errors={errors}
                        />
                    </InlineField>
                    <InlineField width={20} style={{marginLeft: '4%'}}>
                        <MaterialInput
                            materialProps={{
                                required: true,
                                value   : state.address.houseNumber,
                                onChange: handleAddressChange,
                            }}
                            label={intl.formatMessage({id: 'house.number'})}
                            name={'houseNumber'}
                            errors={errors}
                        />
                    </InlineField>
                </Field>
                <Field>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : state.address.postalCode,
                            onChange: handleAddressChange,
                        }}
                        label={intl.formatMessage({id: 'zip'})}
                        name={'postalCode'}
                        errors={errors}
                    />
                </Field>
                <Field>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : state.address.city,
                            onChange: handleAddressChange,
                        }}
                        label={intl.formatMessage({id: 'city'})}
                        name={'city'}
                        errors={errors}
                    />
                </Field>
                <Field style={{marginBottom: 20}}>
                    <MaterialCountrySelect
                        required
                        handleChange={handleAddressChange}
                        defaultValue={state.address.country}
                        errors={errors}
                        label={intl.formatMessage({id: 'country'})}
                    />
                </Field>
                <Field>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : state.payment.payerName,
                            onChange: handlePaymentChange,
                        }}
                        label={intl.formatMessage({id: 'iban.label'})}
                        name={'payerName'}
                        errors={errors}
                    />
                </Field>
                <Field>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : formatIBAN(state.payment.iban, 4),
                            onChange: handlePaymentChange,
                        }}
                        label={'IBAN'}
                        name={'iban'}
                        errors={errors}
                    />
                </Field>
                <Field style={{marginTop: 32}}>
                    <PopupFan
                        handleYes={async () => {
                            const validation = validate(state)
                            if (validation.payment.success && validation.address.success) {
                                try {
                                    const response = await saveData(state)
                                    if (response.data.success) {
                                        await actions.profile.getProfileData({dispatch})
                                        dispatch(actions.message.set({msg: IntlHtmlText('existing.membership.success')}))
                                        navigate('/product/membership/success')
                                    }
                                } catch (error) {
                                    dispatch(actions.notification.set({
                                        msg  : error.data.message,
                                        color: 'danger',
                                    }))
                                }
                                return
                            }

                            validation.payment.dispatchErrors()
                            validation.address.dispatchErrors()
                        }}
                        textId={'membership.edit.confirm.popup.text'}
                    >
                        <MaterialButton
                            disabled={disabled}
                            variant={disabled ? 'contained' : 'text'}
                        >
                            {intl.formatMessage({id: 'membership.edit.confirm.button'})}
                        </MaterialButton>
                    </PopupFan>
                </Field>
            </Layout>
        </>
    )
}

export default withStore(
    withContext(
        MembershipEdit,
        (ctx: GlobalContextT) => ({intl: ctx.intl}),
    ),
    (state: GlobalState) => ({profile: state.profile, errors: state.errors}),
)
