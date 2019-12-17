import React           from 'react'
import {BrowserRouter} from 'react-router-dom'
import {FanIntl}       from '@myfan/commons'


const BrouserRouterWrapper: React.FC = ({children}) => {

    return (
        <BrowserRouter basename={FanIntl.baseLangPath}>
            {children}
        </BrowserRouter>
    )
}

export default BrouserRouterWrapper
