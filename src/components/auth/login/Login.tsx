import React, {
    useEffect,
    useRef,
    useState,
}                                                   from 'react'
import './login.scss'
import {IntlText}                                   from '../../intl/IntlText'
import {STEP_PASSWORD, STEP_EMAIL}                  from './login-step-constants'
import StepConfigs                                  from './StepConfigsV2'
import GetNotificationMessage                       from '../get-notification-message'
import {InitialState}                               from './InitialState'
import {Validator}                                  from '@myfan/validation'
import {User}                                       from '@myfan/base'
import {ClientApp, ClientSteps}                     from '@myfan/clients'
import {ILogin}                                     from './InitialState'
import {unconfirmedErrMsg}                          from '../register/shared/unconfirmedErrMsg'
import {withContext, useDispatch}                   from '@myfan/store'
import {StorageFactory, url, Global, Routes, Types} from '@myfan/commons'
import {redirect}                                   from '@myfan/commons/dist/url1'
import {withModels}                                 from '@myfan/pages'
import {actions, GlobalContextT}                    from 'Redux'
import LoginPresentationv2                          from './LoginPresentationv2'


type PropsType = {
    onChange(e: any): void,
    autoFocus: boolean,
    data: { password: string, [key: string]: string },
    maxStep: number,
    currentStep: number
}

export type InputProps = PropsType & {
    name: string,
    type: string,
    refEl: any
}

export type ButtonProps = {
    onClick(): void,
    goBack(): void,
    disabled: boolean
}

type Props = {
    intl: Types.IntlShape,
    Login: Types.Models.Login
}


function Login({intl, Login}: Props) {

    const storage           = StorageFactory.getStorage()
    const [state, setState] = useState<ILogin>(InitialState)
    const dispatch          = useDispatch()
    //const emailInputEl      = useRef(null)
    const passInputEl       = useRef(null)
    const validationOptions = {
        aliases: {
            password: intl.formatMessage({id: 'password'}),
        },
    }

    useEffect(() => {
        // @ts-ignore
        passInputEl.current && passInputEl.current.focus()
    })

    useEffect(() => {
        const notification = GetNotificationMessage()
        if (notification.id) {


            switch (notification.id) {
                case 'link.expired':

                    const username = storage.getItem('username') || ''

                    dispatch(
                        actions.notification.set({
                            msg   : unconfirmedErrMsg('link.expired', username, dispatch),
                            color : 'danger',
                            fadeIn: 1000,
                        }),
                    )

                    break
                default:
                    notification.success === true && notification.id && dispatch(
                        actions.notification.set({
                            msg  : IntlText(notification.id),
                            color: 'success',
                        }))
                    notification.success === false && notification.id && dispatch(
                        actions.notification.set({
                            msg  : IntlText(notification.id),
                            color: 'danger',
                        }))
            }
        }

        const email = localStorage.getItem('registerEmail')

        if (email) {
            setState(prevState => ({
                ...prevState,
                data    : {...state.data, email: email || ''},
                disabled: false,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        state.step !== STEP_EMAIL && dispatch(actions.backButton.push(goBack))

    }, [state.step])

    const handleSubmit = (): void => {

        if (!validate()) return
        const {step, data, validation} = state

        switch (step) {
            case STEP_EMAIL:
                setState(prevState => ({
                    ...prevState,
                    step    : STEP_PASSWORD,
                    disabled: !Validator.test(validation.password, {password: data.password}, 'password'),
                }))
                break
            case STEP_PASSWORD:

                Login.login({
                    identity: data.email,
                    password: data.password,
                }).then(() => {

                    const urlParams = url.getParams()
                    const mergData  = ClientApp.getMergingData()
                    let ClientStep  = storage.getItem('registerEmail') ? ClientSteps.RESEND : ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION

                    storage.removeItem('registerEmail')

                    if (mergData && mergData.email !== User.email) ClientApp.removeMergingData()

                    Login.postLoginMergeRequest(urlParams.hash)

                    if (urlParams.redirect_uri) {
                        ClientApp.redirectFactory(ClientStep, urlParams)
                    } else {
                        url.removeParam('hash')
                        redirect(Routes.home.build())
                    }

                    Global.bugsnag.user = {emailOrHash: User.email}
                }).catch(res => {
                    setState(prevState => ({
                        ...prevState,
                        step: STEP_EMAIL,
                    }))

                    actions.errors.set({email: {error: {id: res.messageId, values: {}}}}, dispatch)
                })
                break
            default:
                return
        }

    }

    const handleOnChange = (e: any): void => {

        e.persist()

        if (e.keyCode === 13 && e.shiftKey === false) {
            return handleSubmit()
        }

        const name  = e.target.name
        const value = e.target.value

        setState(prevState => ({
            ...prevState,
            data    : {...state.data, [name]: value},
            // @ts-ignore
            disabled: !Validator.test(state.validation[name], {[name]: value}, name),
        }))

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const validate = () => {

        const {data, validation} = state
        const name               = StepConfigs[step].name

        // @ts-ignore
        const [errors, isEmpty]: [any, (boolean)] = Validator(validation, {[name]: data[name]}, validationOptions)
        if (isEmpty) return true

        actions.errors.set(errors, dispatch)
        return false
    }

    const goBack = () => {
        setState(prevState => ({
            ...prevState,
            step    : state.step - 1,
            disabled: false,
        }))
    }

    const {step, disabled, data, maxStep} = state
    const config                          = StepConfigs[step]

    const inputProps: PropsType = {
        onChange   : handleOnChange,
        autoFocus  : true,
        data       : data,
        maxStep    : maxStep,
        currentStep: step,
    }

    //const emailProps: InputProps = {
    //    ...inputProps,
    //    name : 'email',
    //    type : 'email',
    //    refEl: emailInputEl,
    //}
//
    //const passProps: InputProps = {
    //    ...inputProps,
    //    name : 'password',
    //    type : 'password',
    //    refEl: passInputEl,
    //}

    const buttonProps: ButtonProps = {
        onClick : handleSubmit,
        goBack  : goBack,
        disabled: disabled,
    }

    return (
        <LoginPresentationv2
            {...inputProps}
            buttonProps={buttonProps}
            // @ts-ignore
            config={config}
            intl={intl}
        />
    )
}


export default withContext(
    withModels(Login,
        (models: Types.Models.ModelsT) => ({Login: models.Login})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}))

