import {object, Types}                        from '@myfan/commons'
import {withContext, useDispatch, withStore}  from '@myfan/store'
import {Validator}                            from '@myfan/validation'
import {
    styled,
    Containers,
    Container,
    MaterialTooltip,
    MaterialRadio,
    MaterialInput,
    Birthday,
    PhoneInputFacade,
    MaterialButton,
}                                             from '@myfan/web-components'
import * as React                             from 'react'
import {useEffect, useState}                  from 'react'
import {actions, GlobalContextT, GlobalState} from 'Redux'
import {PageHeader, ViewModes, rightIcons}    from '../commons'
import LoginData                              from '../login-data/LoginData'

interface IPersonalData {
    data: {
        gender: string,
        firstName: string,
        lastName: string,
        membershipNumber: string,
        birthDate: string,
        phone: string,
    },
    loginData: {
        email: {
            title: string
            value: string
        },
        password: {
            title: string
        },
    },
    intl: Types.IntlShape
    errors: { birthday: any }
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
    header          : 'profile.personalData.header',
    title           : 'profile.personalData.title',
    tooltip         : 'profile.personalData.tooltip',
    gender          : 'profile.personalData.gender',
    firstName       : 'profile.personalData.firstName',
    lastName        : 'profile.personalData.lastName',
    fullName        : 'profile.personalData.fullName',
    birthDate       : 'profile.personalData.birthDate',
    membershipNumber: 'profile.personalData.membershipNumber',
    phone           : 'profile.personalData.phone',
    save            : 'profile.personalData.save',
}

const PersonalData = ({data, intl, errors}: IPersonalData) => {

    const dispatch                        = useDispatch()
    const [personalData, setPersonalData] = useState({...data})
    const [viewMode, setViewMode]         = useState<ViewModes>(ViewModes.SHOW)
    const [disabled, setDisabled]         = useState(true)

    const {gender, firstName, lastName, membershipNumber, birthDate, phone} = personalData

    useEffect(() => {
        setDisabled(object.isEqual([data], [personalData], []))
        // eslint-disable-next-line
    }, [
        personalData.gender,
        personalData.firstName,
        personalData.lastName,
        personalData.birthDate,
        personalData.phone,
    ])

    const getTranslationById = (id: string): string => {
        if (!id) {
            return ''
        }

        return intl.formatMessage({id})
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist && event.persist()
        dispatch(actions.errors.remove({name: event.target.name}))

        setPersonalData(personalData => {
            return {
                ...personalData,
                [event.target.name]: event.target.value,
            }
        })
    }

    const onSave = () => {
        const rules = {
            firstName: 'string',
            lastName : 'string',
            birthDate: 'date',
            phone    : 'phone',
        }

        const [errors, success] = Validator(rules, personalData)

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
        <>
            <Container size={'small'}>
                <PageHeader
                    className={'title bold'}
                    // @ts-ignore
                    dangerouslySetInnerHTML={{
                        __html: intl.formatHTMLMessage({id: translationKeys.header}),
                    }}/>
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
                                {getTranslationById(translationKeys.fullName)}:
                                {' '}
                                {gender && ` ${getTranslationById(gender)}`}
                                {firstName && ` ${firstName}`}
                                {lastName && ` ${lastName}`}
                            </FieldWithMarginBottom>
                            <FieldWithMarginBottom>
                                {getTranslationById(translationKeys.membershipNumber)}:
                                {' '}
                                {membershipNumber}
                            </FieldWithMarginBottom>
                            <FieldWithMarginBottom>
                                {getTranslationById(translationKeys.birthDate)}:
                                {' '}
                                {birthDate &&
                                ` ${intl.formatDate(birthDate, {
                                    day  : '2-digit',
                                    month: 'short',
                                    year : 'numeric',
                                })}`
                                }
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
                                <MaterialRadio
                                    label={getTranslationById(translationKeys.gender)}
                                    name={'gender'}
                                    value={gender}
                                    onChange={handleChange}
                                    items={[
                                        {
                                            value: 'man',
                                            label: getTranslationById('man'),
                                        },
                                        {
                                            value: 'woman',
                                            label: getTranslationById('woman'),
                                        },
                                        {
                                            value: 'diverse',
                                            label: getTranslationById('diverse'),
                                        },
                                    ]}
                                />
                            </Field>
                            <Field>
                                <InlineField style={{width: '46%', marginRight: '5%'}}>
                                    <MaterialInput
                                        materialProps={{
                                            required: true,
                                            value   : firstName,
                                            onChange: handleChange,
                                        }}
                                        label={getTranslationById(translationKeys.firstName)}
                                        name={'firstName'}
                                        errors={errors}
                                    />
                                </InlineField>
                                <InlineField style={{width: '46%'}}>
                                    <MaterialInput
                                        materialProps={{
                                            required: true,
                                            value   : lastName,
                                            onChange: handleChange,
                                        }}
                                        label={getTranslationById(translationKeys.lastName)}
                                        name={'lastName'}
                                        errors={errors}
                                    />
                                </InlineField>
                            </Field>
                            {!!membershipNumber && (
                                <Field>
                                    <MaterialInput
                                        materialProps={{
                                            disabled: true,
                                            required: true,
                                            value   : membershipNumber,
                                            onChange: handleChange,
                                        }}
                                        label={getTranslationById(translationKeys.membershipNumber)}
                                        name={'membershipNumber'}
                                        errors={errors}
                                    />
                                </Field>
                            )}
                            <Field style={{marginBottom: 12}}>
                                <Birthday
                                    required
                                    name={'birthDate'}
                                    onChange={handleChange}
                                    value={birthDate}
                                    errors={errors}
                                />
                            </Field>
                            <Field style={{marginBottom: 12}}>
                                <PhoneInputFacade
                                    required
                                    phoneStyles={{
                                        containerStyle: {
                                            background  : 'inherit',
                                            borderBottom: '1px solid black',
                                        },
                                        inputStyle    : {
                                            background: 'inherit',
                                        },
                                        buttonStyle   : {
                                            background: 'inherit',
                                        },
                                        dropdownStyle : {
                                            background: '#dadada',
                                        },
                                    }}
                                    onChange={handleChange}
                                    data={phone}
                                    errors={errors}
                                />
                            </Field>
                            <Field style={{marginBottom: 8, marginTop: 32}}>
                                <MaterialButton
                                    disabled={disabled}
                                    variant={disabled ? 'contained' : 'text'}
                                    onClick={onSave}
                                >
                                    {getTranslationById(translationKeys.save)}
                                </MaterialButton>
                            </Field>
                        </>
                    }
                    state={viewMode}/>
            </Container>
            <LoginData email={{
                title: getTranslationById('email'),
                value: '',
            }}/>
        </>
    )
}

export default withContext(
    withStore(PersonalData, (state: GlobalState) => ({errors: state.errors})), (ctx: GlobalContextT) => ({
        intl: ctx.intl,
    }))
