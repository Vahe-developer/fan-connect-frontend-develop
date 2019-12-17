import React, {useEffect, useState}              from 'react'
import {IntlText}                                from '../../intl/IntlText'
import './register.scss'
import Policy                                    from '../policy/Policy'
import ClientForm                                from './clients/ClientForm'
import OldRegister                               from './old-register/Register'
import {request, Club}                           from '@myfan/base'
import {Link}                                    from 'react-router-dom'
import {RegisterFormState}                       from './InitialState'
import {getRegisterUrlParams}                    from './getRegisterUrlParams'
import FcspIDInfo                                from './FcspIDInfo/FcspIDInfo'
import {SuccessContent}                          from './SuccessContent'
import {IRegisterFormState}                      from './InitialState'
import {IInput}                                  from '../../interfaces/interfaces'
import {unconfirmedErrMsg}                       from './shared/unconfirmedErrMsg'
import {Validator}                               from '@myfan/validation'
import {Global, url, AuthCommons, Routes, Types} from '@myfan/commons'
import {register}                                from '@myfan/auth'
import {useDispatch, withContext}                from '@myfan/store'
import {actions, GlobalContextT}                 from 'Redux'

function RegisterFrom({intl}: { intl: Types.IntlShape }) {

    const [state, setState] = useState<IRegisterFormState>(RegisterFormState)
    const dispatch          = useDispatch()
    const validationOptions = {
        aliases: {
            email   : intl.formatMessage({id: 'email'}),
            password: intl.formatMessage({id: 'password'}),
        },
    }


    useEffect(() => {
        const urlParams   = url.getParams()
        const redirectUri = urlParams.redirect_uri
        if (!redirectUri) return

        const filledFields = getRegisterUrlParams(urlParams)

        request.get(Routes.v2.apps.getClientFields.build(), {params: {redirectUri}})
            .then(res => {
                const trimmedFields    = res.data.fields.map((field: string) => field.trim())
                const clientFormFields = [...trimmedFields, 'password']
                let fields             = state.fields

                Object.keys(filledFields).map(name => {
                    // @ts-ignore
                    return fields[name] = filledFields[name]
                })

                setState(prev => ({
                    ...prev,
                    fields          : {...fields},
                    clientFormFields: clientFormFields,
                }))

            }).catch(res => Global.get('bugsnag').notify(JSON.stringify(res)))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (e: IInput): void => {

        const target = e.target
        const name   = target.name

        // @ts-ignore
        const value = isNaN(target.value) ? target.value.trim() : target.value

        setState(prev => ({
            ...prev,
            fields: {
                ...prev.fields,
                [name]: value,
            },
        }))

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const prepareFields = () => {
        const {fields, clientFormFields} = state

        return clientFormFields.reduce((acc, fieldName) => {
            // @ts-ignore
            acc[fieldName] = fields[fieldName]
            return acc
        }, {})
    }

    const validate = (): boolean => {

        const [errors, isEmpty]: [any, (boolean)] = Validator(state.validation, prepareFields(), validationOptions)
        if (isEmpty) return true

        actions.errors.set(errors, dispatch)
        return false

    }

    const handleClick = (): void => {

        if (!validate()) return

        register({...AuthCommons.prepeareRegisterData(state.fields)})
            .then(() => setState(prev => ({
                ...prev,
                successMessage: true,
            }))).catch(err => {

            let emailError: any = {id: 'invalid.register.already.exists'}

            if (err.messageId === 'user.unconfirmed') {
                emailError = unconfirmedErrMsg('user.unconfirmed', err.username, dispatch)
            }

            actions.errors.set({email: {someErr: emailError}}, dispatch)
        })
    }

    const ifOnlyEmailAndPassword = (): boolean => state.clientFormFields.length === 2

    const formContent = (props: any, textAction: string) => {

        const urlParams = url.getParams()

        let Form = <>
            <h6 className={'sub-title main-title'}>
                {IntlText('register.form.title')}
            </h6>
            <ClientForm  {...props} />
        </>

        if (!urlParams.redirect_uri || ifOnlyEmailAndPassword()) {
            Form = <OldRegister parentState={setState}/>
        }

        return (
            <>
                {Form}
                <Policy action={textAction}/>
                <div className="other-suggestions">
                    <Link to={{pathname: '/authorization/login', search: url.search}}>
                        <h6 className={'sub-title'}>
                            {IntlText('already.have.account')}
                            <span
                                className={'bold'}
                                style={{
                                    marginLeft: '8px',
                                    color     : Club.navbarBg,
                                }}>
                                  {IntlText('login.btn')}
                            </span>
                        </h6>
                    </Link>
                </div>
                <FcspIDInfo/>
            </>
        )
    }

    const {clientFormFields, fields, successMessage} = state

    const placeholders = {
        gender     : intl.formatMessage({id: 'gender'}),
        firstname  : intl.formatMessage({id: 'firstName'}),
        lastname   : intl.formatMessage({id: 'lastName'}),
        birthday   : intl.formatMessage({id: 'birthday'}),
        email      : intl.formatMessage({id: 'email'}),
        password   : intl.formatMessage({id: 'password'}),
        phone      : intl.formatMessage({id: 'phone'}),
        company    : intl.formatMessage({id: 'company'}),
        street     : intl.formatMessage({id: 'street'}),
        housenumber: intl.formatMessage({id: 'house.number'}),
        city       : intl.formatMessage({id: 'city'}),
        zip        : intl.formatMessage({id: 'zip'}),
        country    : intl.formatMessage({id: 'country'}),
    }

    const FieldProps = {
        fields      : clientFormFields,
        data        : fields,
        onClick     : handleClick,
        placeholders: placeholders,
        onChange    : handleChange,
    }

    const textAction = `"${intl.formatMessage({id: 'privacy.register'})}"`

    const Content = successMessage ? <SuccessContent/> : formContent(FieldProps, textAction)

    return (
        <div className={'register-form'}>
            {Content}
        </div>
    )
}

export default withContext(RegisterFrom, (ctx: GlobalContextT) => ({intl: ctx.intl}))
