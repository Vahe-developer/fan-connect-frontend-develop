import {withRouter}     from 'react-router-dom'
import {User}           from '@myfan/base'
import {request}        from '@myfan/base'
import {redirect, url}  from '@myfan/commons/dist/url1'
import {StorageFactory} from '@myfan/commons'
import {Loading}        from '@myfan/web-components'


const ConfirmEmail = (props: any) => {

    const storage = StorageFactory.getStorage()
    const hash    = props.match.params.hash

    request.get('/username-hash?hash=' + (hash || ''))
        .then(res => {

            const username = res.data.username

            User.getCognitoUser(username)
                .confirmRegistration(
                    props.match.params.activation_code,
                    false,
                    function (err, result) {

                        if (err) {

                            url.removeParam('linkExpired')
                            let params: any = {confirmationSuccess: '0'}

                            if (err.code === 'ExpiredCodeException') {

                                storage.setItem('username', username)
                                params = {linkExpired: '1'}
                            }

                            redirect('/authorization/login', {params: params, search: false})
                            return
                        }

                        storage.setItem('registerEmail', res.data.email)
                        request.delete('/username-hash', {data: {hash: hash}})

                        User.logout('/authorization/login', {
                            params: {
                                confirmationSuccess: '1',
                            },
                        })
                    })
        })
        .catch(() => {
            User.logout('/authorization/login', {
                params: {
                    invalidHashLink: '1',
                },
                search: false,
            })
        })

    return Loading

}

export default withRouter<any, any>(ConfirmEmail)
