import {useEffect}                from 'react'
import {navigate, Types}          from '@myfan/commons'
import {withContext, useDispatch} from '@myfan/store'
import {actions}                  from 'Redux'

function Connect({intl}: { intl: Types.IntlShape }) {

    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(actions.notification.set({
            msg   : intl.formatMessage({id: 'connect.to.paypal'}),
            color : 'danger',
            fadeIn: 50000,
        }))

        navigate('/profile')
    }, [])

    return null
}

export default withContext(Connect)
