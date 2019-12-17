import './NotFound.scss'
import {Routes}             from '@myfan/commons'
import {navigate}           from '@myfan/commons/dist/url1'
import {withStore}          from '@myfan/store'
import {useEffect}          from 'react'
import {GlobalState, Types} from 'Redux'

type Props = {
    auth: Types.Auth.AuthT
}

const NotFound = ({auth}: Props) => {

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(Routes.profile.personalData.build())
        } else {
            navigate(Routes.authorization.login.build())
        }
    }, [auth])

    return null

}

export default withStore(NotFound, (state: GlobalState) => ({auth: state.auth}))
