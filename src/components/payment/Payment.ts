import React, {useEffect}                        from 'react'
import {StorageFactory, redirect, navigate, url} from '@myfan/commons'
import {Loading}                                 from '@myfan/web-components'
import {request}                                 from '@myfan/base'
import {useDispatch}                             from '@myfan/store'
import {actions}                                 from 'Redux'

function Payment() {

    const dispatch = useDispatch()
    const storage  = StorageFactory.getStorage()

    useEffect(() => {

        if (url.getParam('success') !== 'true') return navigate('profile')

        const token = url.getParam('ba_token')
        request.post('/payment/execute-agreement', {token})
            .then(() => {
                dispatch(actions.notification.set({
                    msg  : 'Paypal connected!',
                    color: 'success',
                }))

                const clientRedirectUrl = storage.getItem('redirectToClient')

                if (clientRedirectUrl) {
                    storage.removeItem('redirectToClient')
                    redirect(clientRedirectUrl)
                    return
                }
                navigate('/profile', {})
            })
            .catch(() => {
                dispatch(actions.notification.set({
                    msg  : 'Something went wrong!',
                    color: 'danger',
                }))
                navigate('/profile', {})
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return Loading
}

export default React.memo<any>(Payment)
