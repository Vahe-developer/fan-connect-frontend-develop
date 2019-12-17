import React, {useContext, useState}                         from 'react'
import {withContext, withStore, useDispatch}                 from '@myfan/store'
import {actions, GlobalContextT, Types, GlobalState}         from 'Redux'
import {Validator}                                           from '@myfan/validation'
import {
    ShadowedContainer,
    MaterialInput,
    MaterialButton,
    MaterialCheckbox,
    // Tooltip
    styled,
}                                                            from '@myfan/web-components'
import {Input, Types as CommonTypes, Intl, navigate, string} from '@myfan/commons'
import {Club, request}                                       from '@myfan/base'
import {MembershipContext}                                   from '../Membership'
// import OutsideClickHandler                                  from 'react-outside-click-handler'
import {IntlHtmlText}                                        from '../../../intl/IntlText'

const MEMBERSHIP_PERSONAL_DATA_PAGE = 0
const MEMBERSHIP_TYPE_PAGE          = 1

const WithMargin = styled.div`
    margin-bottom : 24px;
`

const FieldInline = styled.span`
    margin-right: 8px;
`

const IconUnChecked = styled.i`
    width: 21px;
    height: 24px;
    border: 1px solid #efefef;
    border-radius : 4px;
    border-color    : black;
    background-color: white,
`

const I = styled.i`
    float: right;
    padding: 8px 0;
    cursor: pointer;
    color: ${Club.navbarBg};
    font-size: 16px;
`

const FinalStep = ({intl, lang, errors}: { intl: CommonTypes.IntlShape, lang: string, routePrefix: string, errors: {} }) => {

    const input    = Input.setLang(lang)
    const dispatch = useDispatch()

    const {membership}                       = useContext(MembershipContext)
    const {state, setState, setCurrentIndex} = membership

    const {options, address, payment}   = state
    const [agreeToIBAN, setAgreeToIBAN] = useState(false)
    const [agreeToAGB, setAgreeToAGB]   = useState(false)

    if (!state.payment.payerName) {
        setState({
            ...state,
            payment: {
                ...payment,
                payerName: `${state.address.firstName} ${state.address.lastName}`.toUpperCase(),
            },
        })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name
        let value  = event.target.value

        if ('iban' === name) {
            value = string.removeSpaces(value).slice(0, 22)
        }

        setState({
            ...state,
            payment: {
                ...state.payment,
                [name]: value,
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

    const getTranslationById = (key: string): string => {
        return intl.formatMessage({id: key})
    }

    const validate = (data: any): [boolean, () => void] => {
        const rules = {
            payerName: 'required|string',
            iban     : 'required|min:22|max:22|containsLetterOrNumber',
            bic      : data.bic ? 'required|min:8|max:11|containsLetterOrNumber' : '',
        }

        const [errors, isEmpty]: [any, boolean] = Validator(rules, data)

        return [isEmpty, () => actions.errors.set(errors, dispatch)]

    }

    const saveData = async ({options, address, payment}: Types.Profile.MembershipT) => {
        address.birthDate = address.birthDate.split('-').reverse().join('.')
        let data          = {
            requestType: 'NEW_REQUEST',
            number     : '',
            options    : [],
            address    : [],
            payment    : [],
        }

        for (const key in options) {

            if (!options.hasOwnProperty(key)) {
                continue
            }

            if ('discountFile' === key || 'discountFileName' === key) {
                continue
            }
            // @ts-ignore
            data.options.push({name: key, value: options[key]})
        }

        for (const key in address) {

            if (!address.hasOwnProperty(key)) {
                continue
            }
            // @ts-ignore
            data.address.push({name: key, value: address[key]})
        }

        for (const key in payment) {

            if (!payment.hasOwnProperty(key)) {
                continue
            }
            // @ts-ignore
            data.payment.push({name: key, value: payment[key]})
        }

        return await request.post('/v2/membership', data)
    }

    const formatIBAN = (iban: string, size: number): string => {
        // don't allow more then 22 chars
        iban = string.removeSpaces(iban.slice(0, 22))

        const chunked = iban.match(new RegExp('[a-z0-9]{1,' + size + '}', 'gi'))

        return chunked ? chunked.join(' ') : iban
    }

    return (
        <>
            <p className={'title-18'}>{getTranslationById('summary')}:</p>
            <WithMargin>
                <ShadowedContainer>
                    <div>
                        <I className='fas fa-pencil-alt' title={'Edit'} onClick={() => {
                            setCurrentIndex(MEMBERSHIP_PERSONAL_DATA_PAGE)
                        }}/>
                        {getTranslationById(input.fromValue(address.gender, CommonTypes.InputEnum.Gender))}&nbsp;
                        {address.firstName}&nbsp;
                        {address.middleName && (`${address.middleName} `)}
                        {address.lastName}
                    </div>
                    <div>
                        {address.street}&nbsp;{address.houseNumber}&nbsp;
                        {address.postalCode}&nbsp;
                        {address.city}

                    </div>
                </ShadowedContainer>
            </WithMargin>
            <WithMargin>
                <ShadowedContainer>
                    <div style={{marginBottom: 8}}>
                        {getTranslationById('membership')}:
                        <I className='fas fa-pencil-alt' title={'Edit'} onClick={() => {
                            setCurrentIndex(MEMBERSHIP_TYPE_PAGE)
                        }}/>
                    </div>
                    <FieldInline>{getTranslationById(options.membershipType)}</FieldInline>
                    <FieldInline>{getTranslationById(options.sportType)}</FieldInline>
                </ShadowedContainer>
            </WithMargin>
            <WithMargin>
                <ShadowedContainer>
                    <div>
                        {/*<div*/}
                        {/*    style={{float: 'right'}}*/}
                        {/*>*/}
                        {/*    <MaterialTooltip/>*/}
                        {/*</div>*/}
                        {getTranslationById('membership.payment.method')}:
                    </div>
                    <div style={{
                        textAlign: 'center',
                        margin   : '16px 0',
                    }}>
                        <img
                            src={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Single_Euro_Payments_Area_logo.svg/800px-Single_Euro_Payments_Area_logo.svg.png'}
                            alt={'logo'}
                            width={120}
                        />
                    </div>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : payment.payerName,
                            onChange: handleChange,
                        }}
                        label={getTranslationById('firstName') + ' ' + getTranslationById('lastName')}
                        name={'payerName'}
                        errors={errors}
                    />
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : formatIBAN(payment.iban, 4),
                            onChange: handleChange,
                        }}
                        label={'IBAN'}
                        name={'iban'}
                        errors={errors}
                    />
                    <MaterialInput
                        materialProps={{
                            value   : payment.bic,
                            onChange: handleChange,
                        }}
                        label={'BIC'}
                        name={'bic'}
                        errors={errors}
                    />
                    <div style={{marginTop: '8px'}}>
                        <MaterialCheckbox
                            name={'agreeIBAN'}
                            value={agreeToIBAN}
                            onChange={setAgreeToIBAN}
                            UncheckedIcon={IconUnChecked}
                            label={intl.formatMessage({id: 'membership.agree.to.IBAN'})}
                        />
                    </div>
                </ShadowedContainer>
            </WithMargin>
            <WithMargin>
                <label style={{display: 'flex'}}>
                    <MaterialCheckbox
                        name={'agreeToAGB'}
                        value={agreeToAGB}
                        onChange={setAgreeToAGB}
                        label={''}
                    />
                    <span
                        style={{marginLeft: -8}}
                        // @ts-ignore
                        dangerouslySetInnerHTML={{
                            __html: intl.formatHTMLMessage({id: 'membership.agree.to.AGB'}),
                        }}
                    />
                </label>
            </WithMargin>
            <MaterialButton
                disabled={!agreeToIBAN || !agreeToAGB}
                onClick={async () => {
                    const [success, dispatchErrors] = validate(state.payment)

                    if (agreeToIBAN && agreeToAGB && success) {
                        try {
                            const response = await saveData(state)
                            if (response.data.success) {
                                await actions.profile.getProfileData({dispatch})
                                dispatch(actions.message.set({msg: IntlHtmlText('register.membership.success')}))
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
                    dispatchErrors()
                }}
                variant={!agreeToIBAN || !agreeToAGB ? 'contained' : 'text'}
            >
                {intl.formatMessage({id: 'membership.final.step.cta.button'})}
            </MaterialButton>
        </>
    )
}

export default withContext(
    withStore(
        Intl.withIntl(FinalStep), (state: GlobalState) => ({errors: state.errors})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}),
)
