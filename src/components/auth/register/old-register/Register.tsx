import React, {useEffect, useRef, useState} from 'react'
import './register.scss'
import {IntlText}                           from '../../../intl/IntlText'
import StepConfigs                          from './StepConfigs'
import {STEP_EMAIL, STEP_PASSWORD}          from './register-step-constants'
import {Validator}                          from '@myfan/validation'
import {IInput}                             from '../../../interfaces/interfaces'
import {IRegisterFormState}                 from '../InitialState'
import {unconfirmedErrMsg}                  from '../shared/unconfirmedErrMsg'
import {StorageFactory, url, AuthCommons}   from '@myfan/commons'
import {register}                           from '@myfan/auth'
import {useDispatch}                        from '@myfan/store'
import {actions}                            from 'Redux'
import {withRouter}                         from 'react-router-dom'
import RegisterPresentationV2               from './RegisterPresentationV2'

type IProps = {
    parentState: IRegisterFormState
}

interface IRegister {
    subscriptionEmail: boolean,
    data: {
        email: string,
        password: string
    },
    disabled: boolean,
    step: number,
    maxStep: number,
    validation: {
        email: string,
        password: string
    }
}

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

function OldRegister(props: IProps) {

    const storage           = StorageFactory.getStorage()
    const subscriptionEmail = url.get('hash') ? storage.getItem('subscriptionEmail') : null

    const email = (): string => {
        const linkEmail = url.getParam('account_link[email]')

        if (linkEmail) {
            return linkEmail
        }

        if (subscriptionEmail) {
            return subscriptionEmail
        }

        return ''
    }

    const [state, setState] = useState<IRegister>({
        subscriptionEmail: subscriptionEmail ? true : false,
        data             : {
            email   : email(),
            password: '',
        },
        disabled         : email() ? false : true,
        step             : STEP_EMAIL,
        maxStep          : 2,
        validation       : {
            email   : 'required|email',
            password: 'required|min:8|containNumber|containLowAndUpLetter|containSpecialChar',
        },
    })

    const dispatch     = useDispatch()
    const emailInputEl = useRef(null)
    const passInputEl  = useRef(null)

    useEffect(() => {
        // @ts-ignore
        passInputEl.current && passInputEl.current.focus()
    })

    const handleSubmit = (): void => {

        if (validate()) {
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
                    // @ts-ignore
                    register({...AuthCommons.prepeareRegisterData(data)})
                        .then(() => {
                            // @ts-ignore
                            props.parentState(prev => ({
                                ...prev,
                                successMessage: true,
                            }))
                            storage.removeItem('subscriptionEmail')
                        }).catch(res => {

                        let emailError = IntlText(res.messageId)

                        if (res.messageId === 'user.unconfirmed') {
                            emailError = unconfirmedErrMsg('user.unconfirmed', res.username, dispatch)
                        }

                        setState(prevState => ({
                            ...prevState,
                            step: STEP_EMAIL,
                        }))

                        actions.errors.set({email: {error: emailError}}, dispatch)
                    })
                    break
                default:
                    return
            }
        }
    }

    const handleOnChange = (e: IInput): void => {

        // @ts-ignore
        if (e.keyCode === 13 && e.shiftKey === false) {
            return handleSubmit()
        }

        const name  = e.target.name
        const value = e.target.value


        setState(prevState => ({
            ...prevState,
            data    : {...prevState.data, [name]: value},
            // @ts-ignore
            disabled: !Validator.test(prevState.validation[name], {[name]: value}, name),
        }))

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const validate = (): boolean => {

        const {data, validation, step} = state
        // @ts-ignore
        const name                     = StepConfigs[step].name

        // @ts-ignore
        const [errors, isEmpty]: [any, (boolean)] = Validator(validation, {[name]: data[name]})
        if (isEmpty) return true

        actions.errors.set(errors, dispatch)
        return false
    }

    const goBack = (): void => {
        setState(prevState => ({
            ...prevState,
            step    : state.step - 1,
            disabled: false,
        }))
    }

    const {step, disabled, data, maxStep} = state

    // @ts-ignore
    const config = StepConfigs[step]

    const inputProps: PropsType = {
        onChange   : handleOnChange,
        autoFocus  : true,
        data       : data,
        maxStep    : maxStep,
        currentStep: step,
    }

    const emailProps: InputProps = {
        ...inputProps,
        autoFocus: !subscriptionEmail,
        name     : 'email',
        type     : 'email',
        refEl    : emailInputEl,
    }

    const passProps: InputProps = {
        ...inputProps,
        name : 'password',
        type : 'password',
        refEl: passInputEl,
    }

    const buttonProps = {
        onClick : handleSubmit,
        goBack  : goBack,
        disabled: disabled,
    }

    return (
        <RegisterPresentationV2
            onChange={handleOnChange}
            config={config}
            buttonProps={buttonProps}
            emailProps={emailProps}
            passProps={passProps}
            subscriptionEmail={subscriptionEmail}
        />
    )
}

export default withRouter<any, any>(OldRegister)
