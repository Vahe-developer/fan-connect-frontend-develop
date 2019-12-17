import React            from 'react'
import {Global, object} from '@myfan/commons'
import './style.scss'

export const ErrorsV2 = ({errors}: { [key: string]: { id: string, values: {} } }) => {

    if (object.isEmpty(errors)) {
        return null
    }

    return (
        <div className={'errors-block errors text'}>
            {Object.keys(errors).map((error, key) => {
                return <p key={key}>
                    {Global.intl.formatMessage({
                        // @ts-ignore
                        id: errors[error].id,
                        // @ts-ignore
                    }, errors[error].values)}</p>
            })}
        </div>
    )
}
