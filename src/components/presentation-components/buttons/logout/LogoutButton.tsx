import React      from 'react'
import {IntlText} from "../../../intl/IntlText"
import Button     from "../auth/Button"
import {User}     from "@myfan/base"

const LogoutButton = () =>
    <Button onClick={() => User.logout("/", {})} className={'logout-button sub-title ghost'}>
        <i className="fas fa-sign-out-alt logout-icon"/>
        {IntlText('logout')}
    </Button>

export default LogoutButton

