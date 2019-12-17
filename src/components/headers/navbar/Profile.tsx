import React                                   from 'react'
import {getActiveTabFromUrl}                   from '@myfan/commons/dist/utils'
import {IntlText}                              from '../../intl/IntlText'
import {Link, withRouter, RouteComponentProps} from 'react-router-dom'
import {User}                                  from '@myfan/base'
import {Conditional}                           from '@myfan/web-components'
import {url}                                   from '@myfan/commons'

// @ts-ignore
const Profile: React.FC<RouteComponentProps<{ showLinks: boolean }>> = ({showLinks}) => {

    const path: string = User.hasValidSession() ? '/profile' : '/register'

    return (
        <Conditional cond={showLinks}>
            <Link
                to={path + url.search}
                className={'profile'}
            >
                <span className={`navbar-texts ${getActiveTabFromUrl() === 'profile' ? 'active' : ''}`}>
                    {IntlText('nav.profile')}
                </span>
            </Link>
        </Conditional>
    )
}

export default withRouter(Profile)
