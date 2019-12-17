import React           from 'react'
import {FanIntl, Intl} from '@myfan/commons'
import './style.scss'

const LanguageIcons = ({setLang}: { setLang: (lang: string) => void }): JSX.Element => {

    return (
        <div className={'country-flag-icons'}>
            <img alt="" onClick={() => setLang(FanIntl.urlWithLang('de'))} className={'DE'}
                 src={'/flags/DE.svg'}/>
            <img alt="" onClick={() => setLang(FanIntl.urlWithLang('en'))} className={'US'}
                 src={'/flags/US.svg'}/>
        </div>
    )
}

// @ts-ignore
export default Intl.withIntl(LanguageIcons)
