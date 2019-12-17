import {url}      from '@myfan/commons/dist/url1'
import {IntlText} from '../../intl/IntlText'
import {User}     from '@myfan/base'
import {actions}  from 'Redux'

export const resendActivation = (username: string, dispatch: Function): void => {

    User.getCognitoUser(username)
        .resendConfirmationCode(async function (err) {
            if (err) {
                dispatch(
                    actions.notification.set({
                        msg   : IntlText('something.went.wrong'),
                        color : 'danger',
                        fadeIn: 5,
                    }))
                return
            }
            await dispatch(
                actions.notification.set({
                    msg   : IntlText('successfully.resended'),
                    color : 'success',
                    fadeIn: 5,
                }))
            url.removeParam('linkExpired')
            localStorage.removeItem('username')
        })
}
