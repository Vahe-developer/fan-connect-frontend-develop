import {rightIcons, ViewModes, PageHeader}    from '../commons'
import * as React                             from 'react'
import {useState}                             from 'react'
import {withContext, withStore, useDispatch}  from '@myfan/store'
import {actions, GlobalContextT, GlobalState} from 'Redux'
import {
    styled,
    Containers,
    Container,
    MaterialTooltip,
    MaterialInput,
    MaterialButton,
    MaterialCountrySelect,
}                                             from '@myfan/web-components'
import {Validator}                            from '@myfan/validation'
import {Types}                                from '@myfan/commons'

const countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/de.json'))

interface IAddressInfo {
    data: {
        firstName: string,
        lastName: string,
        company?: string,
        street: string,
        houseNumber: string,
        zip: string,
        city: string,
        additionalAddress?: string,
        country: string,
        phone: string
    },
    intl: Types.IntlShape
    errors: {}
}

const FieldWithMarginBottom = styled.div`
    margin: 0 auto 8px;
`

const Field = styled.div`
`

const InlineField = styled.div`
    display: inline-block
`

const translationKeys = {
    header           : 'profile.addressInfo.header',
    title            : 'profile.addressInfo.title',
    fullName         : 'profile.personalData.fullName',
    tooltip          : 'profile.addressInfo.tooltip',
    company          : 'profile.addressInfo.company',
    street           : 'profile.addressInfo.street',
    houseNumber      : 'profile.addressInfo.houseNumber',
    additionalAddress: 'profile.addressInfo.additionalAddress',
    phone            : 'profile.addressInfo.phone',
    zip              : 'profile.addressInfo.zip',
    city             : 'profile.addressInfo.city',
    save             : 'profile.addressInfo.save',
    country          : 'country',
}

const AddressInfo = ({data, intl, errors}: IAddressInfo) => {

    const dispatch                = useDispatch()
    const [address, setAddress]   = useState({...data})
    const [viewMode, setViewMode] = useState(ViewModes.SHOW)

    const {firstName, lastName, street, houseNumber, zip, city, additionalAddress, country, phone, company} = address

    const getTranslationById = (id: string): string => {
        if (!id) {
            return ''
        }

        return intl.formatMessage({id})
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist && event.persist()
        dispatch(actions.errors.remove({name: event.target.name}))

        setAddress(address => ({
            ...address,
            [event.target.name]: event.target.value,
        }))
    }

    const onSave = () => {
        const rules = {
            company    : 'string',
            street     : 'required|string',
            houseNumber: 'required|containNumber',
            zip        : 'required|containNumber',
            city       : 'required|string',
            country    : 'required|string',
        }

        // @ts-ignore
        const [errors, success] = Validator(rules, address)

        if (success) {
            // save data
            setViewMode(ViewModes.SHOW)
            dispatch(
                actions.notification.set({
                    msg  : getTranslationById('profile.savedSuccessfullyNotification'),
                    color: 'success',
                }),
            )
            return
        }

        actions.errors.set(errors, dispatch)
    }

    return (
        <Container size={'small'}>
            <PageHeader
                className={'title bold'}
                // @ts-ignore
                dangerouslySetInnerHTML={{
                    __html: intl.formatHTMLMessage({id: translationKeys.header}),
                }}
            />
            <Containers.BoxContainer
                header={{
                    left  : <MaterialTooltip content={getTranslationById(translationKeys.tooltip)}/>,
                    center: <span className={'title'}>{getTranslationById(translationKeys.title)}</span>,
                    right : rightIcons({
                        onEditClick: () => setViewMode(ViewModes.SHOW),
                        onShowClick: () => setViewMode(ViewModes.EDIT),
                    })[viewMode],
                }}
                contentShow={
                    <>
                        <FieldWithMarginBottom>
                            {getTranslationById(translationKeys.company)}:
                            {' '}
                            {company}
                        </FieldWithMarginBottom>
                        <FieldWithMarginBottom>
                            {getTranslationById(translationKeys.fullName)}:
                            {' '}
                            {firstName && firstName}
                            {' '}
                            {lastName && lastName}
                        </FieldWithMarginBottom>
                        <FieldWithMarginBottom>
                            {getTranslationById(translationKeys.additionalAddress)}:
                            {' '}
                            {street && street}
                            {' '}
                            {houseNumber && houseNumber}
                        </FieldWithMarginBottom>
                        <FieldWithMarginBottom>
                            {getTranslationById(translationKeys.zip)}
                            {'/'}
                            {getTranslationById(translationKeys.city)}:
                            {' '}
                            {zip && ` ${zip}`}
                            {city && ` ${city}`}
                        </FieldWithMarginBottom>
                        <FieldWithMarginBottom>
                            {getTranslationById(translationKeys.country)}:
                            {' '}
                            {countries.getName(country, 'de')}
                        </FieldWithMarginBottom>
                        <FieldWithMarginBottom>
                            {getTranslationById(translationKeys.phone)}:
                            {' '}
                            {phone}
                        </FieldWithMarginBottom>
                    </>
                }
                contentEdit={
                    <>
                        <Field>
                            <MaterialInput
                                materialProps={{
                                    value   : company,
                                    onChange: handleChange,
                                }}
                                label={getTranslationById(translationKeys.company)}
                                name={'company'}
                                errors={errors}
                            />
                        </Field>
                        <Field>
                            <InlineField style={{width: '75%'}}>
                                <MaterialInput
                                    materialProps={{
                                        required: true,
                                        value   : street,
                                        onChange: handleChange,
                                    }}
                                    label={getTranslationById(translationKeys.street)}
                                    name={'street'}
                                    errors={errors}
                                />
                            </InlineField>
                            <InlineField style={{width: '20%', marginLeft: '4%'}}>
                                <MaterialInput
                                    materialProps={{
                                        required: true,
                                        value   : houseNumber,
                                        onChange: handleChange,
                                    }}
                                    label={getTranslationById(translationKeys.houseNumber)}
                                    name={'houseNumber'}
                                    errors={errors}
                                />
                            </InlineField>
                        </Field>
                        <Field>
                            <MaterialInput
                                materialProps={{
                                    value   : additionalAddress,
                                    onChange: handleChange,
                                }}
                                label={getTranslationById(translationKeys.additionalAddress)}
                                name={'additionalAddress'}
                                errors={errors}
                            />
                        </Field>
                        <Field>
                            <MaterialInput
                                materialProps={{
                                    required: true,
                                    value   : zip,
                                    onChange: handleChange,
                                }}
                                label={getTranslationById(translationKeys.zip)}
                                name={'zip'}
                                errors={errors}
                            />
                        </Field>
                        <Field>
                            <MaterialInput
                                materialProps={{
                                    required: true,
                                    value   : city,
                                    onChange: handleChange,
                                }}
                                label={getTranslationById(translationKeys.city)}
                                name={'city'}
                                errors={errors}
                            />
                        </Field>
                        <Field>
                            <MaterialCountrySelect
                                required
                                handleChange={handleChange}
                                defaultValue={country}
                                label={intl.formatMessage({id: 'country'})}
                                errors={errors}
                            />
                        </Field>
                        <Field style={{marginBottom: 8, marginTop: 32}}>
                            <MaterialButton
                                variant={'text'}
                                onClick={onSave}
                            >
                                {getTranslationById(translationKeys.save)}
                            </MaterialButton>
                        </Field>
                    </>
                }
                state={viewMode}/>
        </Container>
    )
}

export default withContext(
    withStore(
        AddressInfo,
        (store: GlobalState) => ({errors: store.errors})),
    (ctx: GlobalContextT) => ({
        intl: ctx.intl,
    }),
)
