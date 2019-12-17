import React        from 'react'
import './logo.scss'
import {Link}       from 'react-router-dom'
import {User, Club} from '@myfan/base'
import {url}        from '@myfan/commons'

const path: string = User.hasValidSession() ? '/profile' : '/authorization/login'

const Logo = () => (
    <Link to={path + url.search} className={`logo-link`}
          style={{pointerEvents: !Club.isEnabledNavTabs ? 'none' : 'initial'}}>
        <img className={Club.name} src={Club.logo} alt=""/>
    </Link>
)

export default Logo
