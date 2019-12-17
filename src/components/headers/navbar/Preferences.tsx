import React                                   from 'react'
import {getActiveTabFromUrl}                   from '@myfan/commons/dist/utils'
import {IntlText}                              from '../../intl/IntlText'
import {Link, withRouter, RouteComponentProps} from 'react-router-dom'
import {url}                                   from '@myfan/commons'
import {Conditional}                           from '@myfan/web-components'

// @ts-ignore
const Preferences: React.FC<RouteComponentProps<{ showLinks: boolean }>> = ({showLinks}) => {
    let hash = url.get('hash')
    hash     = hash ? '/' + hash : ''

    return (
        <Conditional cond={showLinks}>
            <Link
                to={'/p' + hash + url.search}
                className={'preference'}
            >
                <span className={`navbar-texts ${getActiveTabFromUrl() === 'p' ? 'active' : ''}`}>
                    {IntlText('nav.preferences')}
                </span>
            </Link>
        </Conditional>
    )
}

export default withRouter(Preferences)
