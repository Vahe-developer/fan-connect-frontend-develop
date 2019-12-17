import React, {useEffect, useRef, useState} from 'react'
import './styles.scss'
import {request}                            from '@myfan/base'
import {withContext, useDispatch}           from '@myfan/store'
import {actions}                            from 'Redux'
import {Types}                              from '@myfan/commons'

function ActiveButton({email, intl}: { email: string, intl: Types.IntlShape }) {

    const [show, setShow] = useState<boolean>(false)

    const dispatch = useDispatch()

    const optionsRef: { current: null | HTMLElement } = useRef(null)
    const ellipsRef: { current: null | HTMLElement }  = useRef(null)

    const remove = async (): Promise<void> => {
        await request.post('/payment/agreement/deactivate')

        dispatch(actions.profile.removePaypalConnection())
        dispatch(actions.notification.set({
            msg  : intl.formatMessage({id: 'payment.deactivated'}),
            color: 'success',
        }))
    }

    const Options = () => {
        if (!show) return
        return (
            // @ts-ignore
            <ul className={'options'} ref={optionsRef}>
                <li onClick={remove}>Remove</li>
            </ul>
        )
    }

    const toggleOptions = (e: Event): void => {

        const node = e.target

        if (ellipsRef.current && node instanceof Node && ellipsRef.current.contains(node)) {
            setShow(show => !show)
            return
        }

        setShow(false)
    }

    useEffect(() => {
        document.addEventListener('click', toggleOptions)

        return () => {
            document.removeEventListener('click', toggleOptions)
        }
    }, [])

    return (
        <div className={'paypal-button active'}>
            <div className={'logo-container'}>
                <img className={'logo'} src="/paypal/logo.png" alt=""/>
            </div>
            <div className={'paypal-email'} title={email}>
                <p className={'text'}>{email}</p>
            </div>
            <i className="fas fa-ellipsis-v" ref={ellipsRef}></i>
            {Options()}
        </div>
    )
}

export default withContext(ActiveButton, (ctx: { intl: any; }) => ({intl: ctx.intl}))
