import React      from 'react'
import {IntlText} from "../../intl/IntlText";

export const SuccessContent = () => {
    return (
        <div className="title">
            <div style={{textAlign: 'center', marginTop: '30px'}} className="success-message">
                <p>
                    {IntlText('success')}
                </p>
                <p>
                    {IntlText('check.your.email')}
                </p>
            </div>
        </div>
    )
}
