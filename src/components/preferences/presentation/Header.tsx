import React  from 'react'
import './header.scss'
import {Club} from '@myfan/base'

const Header = ({intl}: any) => {

    return (
        <div className="preference-text title" style={{color: Club.prefTitleC}}>
            <p className={'bold'}>{intl({id: 'nav.preferences'})}</p>
            <p className={'fan-profile-text-description sub-title'}>
                {intl({id: 'preferences.description'})}
            </p>
        </div>
    )
}

export default React.memo<any>(Header)
